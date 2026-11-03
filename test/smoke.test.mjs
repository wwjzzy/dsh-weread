import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  buildWebReadPayload,
  calWereadHash,
  devicePair,
  encodeReadForm,
  WEREAD_READ_KEY,
  wereadE,
  wereadReadSignature,
} from '../lib/crypto.js'
import { DEMO_BOOK_ID, isDemoBook } from '../lib/demo.js'
import { formatReadingTime, mergeProgressByRecency, resumeChapterUid } from '../lib/progress.js'
import { isSessionExpiredCode, throwIfWereadPayloadError, WereadReaderError } from '../lib/reader.js'
import { estimateProgress, WereadService } from '../lib/service.js'
import { cookieHeaderFromSetCookies, qrSvg } from '../qr-login.js'

test('demo book id is recognized', () => {
  assert.equal(isDemoBook(DEMO_BOOK_ID), true)
  assert.equal(isDemoBook('3300021605'), false)
})

test('QR encoder returns an SVG', () => {
  const svg = qrSvg('https://weread.qq.com/web/confirm?pf=2&uid=test-uid')
  assert.match(svg, /<svg/)
  assert.match(svg, /<path|<rect/)
})

test('Set-Cookie values merge into a Cookie header', () => {
  const header = cookieHeaderFromSetCookies(['wr_vid=1; Path=/', 'wr_skey=abc; HttpOnly'])
  assert.match(header, /wr_vid=1/)
  assert.match(header, /wr_skey=abc/)
})

test('wereadE is stable for a numeric id', () => {
  const hash = wereadE('3300021605')
  assert.equal(typeof hash, 'string')
  assert.ok(hash.length >= 20)
  assert.equal(hash, wereadE('3300021605'))
})

test('progress signature matches the verified findmover sample', () => {
  const ts = 1744264311434
  const rn = 466
  const expected = createHash('sha256').update(`${ts}${rn}${WEREAD_READ_KEY}`, 'utf8').digest('hex')
  assert.equal(wereadReadSignature(ts, rn), expected)
  assert.equal(expected.length, 64)
})

test('web read payload uses encoded ids, KEY signature and clamped fields', () => {
  const payload = buildWebReadPayload({
    bookId: '3300021605',
    chapterUid: 12,
    chapterIdx: 3,
    scrollRatio: 0.42,
    progress: 17.9,
    readingTimeSeconds: 12,
    summary: 'abc',
    appId: 'wbtest',
    now: 1_700_000_000_000,
    rn: 7,
  })
  assert.equal(payload.b, wereadE('3300021605'))
  assert.equal(payload.c, wereadE(12))
  assert.equal(payload.ci, 3)
  assert.equal(payload.co, 420)
  assert.equal(payload.pr, 17)
  assert.equal(payload.rt, 12)
  assert.equal(payload.sg, wereadReadSignature(payload.ts, payload.rn))
  const { s, ...unsigned } = payload
  assert.equal(s, calWereadHash(encodeReadForm(unsigned)))
  const pair = devicePair('wbtest')
  assert.equal(payload.ps, pair.ps)
  assert.equal(payload.pc, pair.pc)
})

test('local progress wins when it is newer than cloud', () => {
  const local = { bookId: '1', chapterUid: 9, progress: 40, updatedAt: 2_000_000 }
  const cloud = { bookId: '1', chapterUid: 2, progress: 10, updateTime: 1 }
  const merged = mergeProgressByRecency(local, cloud)
  assert.equal(merged.source, 'local')
  assert.equal(merged.chapterUid, 9)
  assert.equal(merged.progress, 40)
})

test('cloud progress wins when it is newer than local', () => {
  const local = { bookId: '1', chapterUid: 9, progress: 40, updatedAt: 1000 }
  const cloud = { bookId: '1', chapterUid: 4, progress: 55, updateTime: 10 }
  const merged = mergeProgressByRecency(local, cloud)
  assert.equal(merged.source, 'cloud')
  assert.equal(merged.chapterUid, 4)
})

test('resume prefers the fresher local chapter', () => {
  const positions = { '1': { chapterUid: 8, updatedAt: Date.now() } }
  assert.equal(resumeChapterUid(positions, '1', { chapterUid: 2, updateTime: 1 }, 1), 8)
  assert.equal(resumeChapterUid({}, '1', { chapterUid: 2, updateTime: 99 }, 1), 2)
  assert.equal(resumeChapterUid({}, '1', undefined, 5), 5)
})

test('word-count progress estimate stays inside 0–100', () => {
  const chapters = [
    { wordCount: 100 },
    { wordCount: 100 },
    { wordCount: 100 },
  ]
  assert.equal(estimateProgress(chapters, 0, 0), 0)
  assert.equal(estimateProgress(chapters, 1, 50), 50)
  assert.equal(estimateProgress(chapters, 2, 100), 100)
})

test('reading time labels', () => {
  assert.equal(formatReadingTime(0), '')
  assert.equal(formatReadingTime(90), '2 分钟')
  assert.equal(formatReadingTime(3600), '1 小时')
})

test('expired WeRead errCode becomes session-expired', () => {
  assert.equal(isSessionExpiredCode(-2012), true)
  assert.throws(
    () => throwIfWereadPayloadError({ errCode: -2010 }),
    (error) => error instanceof WereadReaderError && error.code === 'weread/session-expired',
  )
})

test('remembered positions keep progress fields and a sticky device pair', async () => {
  const dataDir = await mkdtemp(join(tmpdir(), 'dsh-weread-'))
  const service = new WereadService({ ctx: { logger: { info() {}, warn() {}, debug() {} } }, config: { dataDir } })
  const saved = await service.rememberPosition({
    bookId: '3300021605',
    chapterUid: 12,
    chapterIdx: 3,
    progress: 18,
    readingTime: 90,
  })
  assert.equal(saved.chapterUid, 12)
  assert.equal(saved.progress, 18)
  const status = await service.status()
  assert.equal(status.positions['3300021605'].chapterUid, 12)
  const device = await service.deviceIdentity()
  assert.match(device.appId, /^wb/)
  assert.equal(device.ps.length, 23)
  const again = await service.deviceIdentity()
  assert.equal(again.appId, device.appId)
})

test('unsigned plugin serves the demo shelf and chapter', async () => {
  const dataDir = await mkdtemp(join(tmpdir(), 'dsh-weread-'))
  const service = new WereadService({ ctx: { logger: { info() {}, warn() {}, debug() {} } }, config: { dataDir } })
  const shelf = await service.shelf()
  assert.equal(shelf.demo, true)
  assert.equal(shelf.books[0].bookId, DEMO_BOOK_ID)
  const chapter = await service.chapter(DEMO_BOOK_ID, 1)
  assert.ok(chapter.paragraphs.length > 0)
  assert.equal(chapter.demo, true)
  const resolved = await service.resolveBookId('演示')
  assert.equal(resolved, DEMO_BOOK_ID)
})

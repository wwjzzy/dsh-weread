import assert from 'node:assert/strict'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { wereadE } from '../lib/crypto.js'
import { DEMO_BOOK_ID, isDemoBook } from '../lib/demo.js'
import { WereadService } from '../lib/service.js'
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

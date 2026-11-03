/**
 * Local vs cloud reading-progress helpers.
 *
 * Positions written from this panel and WeRead's own `/book/getProgress`
 * both describe the same book; the fresher record wins so a report that
 * has not landed yet still reopens the chapter you were in.
 */

/**
 * Merge a locally remembered position with WeRead's cloud progress.
 *
 * Local `updatedAt` is milliseconds; cloud `updateTime` is Unix seconds.
 * A local record without a chapter is ignored so an empty store cannot
 * hide a real cloud position.
 *
 * @param local - `{ chapterUid, chapterIdx, chapterOffset, progress, readingTime, updatedAt }`.
 * @param cloud - normalized cloud progress, or undefined.
 */
export function mergeProgressByRecency(local, cloud) {
  const localUid = Number(local?.chapterUid) || 0
  const localAt = Number(local?.updatedAt) || 0
  const cloudAt = (Number(cloud?.updateTime) || 0) * 1000
  const cloudUid = Number(cloud?.chapterUid) || 0

  if (localUid > 0 && (cloudUid <= 0 || localAt > cloudAt)) {
    const progress = Number(local?.progress)
    return {
      ...(cloud ?? {}),
      bookId: String(local?.bookId ?? cloud?.bookId ?? ''),
      chapterUid: localUid,
      chapterIdx: Number(local?.chapterIdx) || Number(cloud?.chapterIdx) || 0,
      chapterOffset: Number(local?.chapterOffset) || 0,
      progress: Number.isFinite(progress) ? Math.max(0, Math.min(100, Math.round(progress))) : Number(cloud?.progress) || 0,
      updateTime: Math.floor(localAt / 1000) || Number(cloud?.updateTime) || 0,
      recordReadingTime: Number(local?.readingTime) || Number(cloud?.recordReadingTime) || 0,
      source: 'local',
    }
  }

  if (cloud === undefined || cloud === null) {
    return localUid > 0
      ? {
          bookId: String(local.bookId ?? ''),
          chapterUid: localUid,
          chapterIdx: Number(local.chapterIdx) || 0,
          chapterOffset: Number(local.chapterOffset) || 0,
          progress: Number(local.progress) || 0,
          updateTime: Math.floor(localAt / 1000),
          recordReadingTime: Number(local.readingTime) || 0,
          source: 'local',
        }
      : undefined
  }

  return { ...cloud, source: cloud.source ?? 'cloud' }
}

/**
 * Which chapter a book should open at, using the merged progress.
 *
 * @param positions - remembered positions, keyed by book id.
 * @param bookId - the book being opened.
 * @param progress - merged progress record, or undefined.
 * @param firstUid - the first chapter with real text, as a last resort.
 */
export function resumeChapterUid(positions, bookId, progress, firstUid) {
  const remembered = positions === undefined || positions === null ? undefined : positions[String(bookId)]
  const merged = mergeProgressByRecency(remembered ? { ...remembered, bookId } : undefined, progress)
  const uid = Number(merged?.chapterUid) || 0
  if (uid > 0) return uid
  return Number.isFinite(firstUid) && firstUid > 0 ? firstUid : 0
}

/**
 * Format a reading-time duration in seconds as a short Chinese label.
 * @param seconds - accumulated reading time.
 */
export function formatReadingTime(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0))
  if (value < 60) return value > 0 ? `${value} 秒` : ''
  const minutes = Math.round(value / 60)
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest > 0 ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`
}

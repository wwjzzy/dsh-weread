/**
 * Agent-facing tools.
 *
 * Names: weread_shelf / weread_search / weread_book / weread_chapter.
 * If weread-export (or another plugin) already took a name, that tool is
 * skipped so the sidebar and `/api/weread` still load.
 */

/** Shared result schema: `text` for the model, `json` for structure. */
const OUTPUT = {
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['text', 'json'],
    properties: {
      text: { type: 'string' },
      json: { type: 'string' },
    },
  },
  render(_args, value) {
    return [{ type: 'text', text: value.text }]
  },
}

/** Build `{ text, json }` from a text body and its structured source. */
function result(text, data) {
  return { text, json: JSON.stringify(data ?? null) }
}

/** Truncate long book text so one tool result stays readable. */
function clip(text, limit = 120) {
  const value = String(text ?? '').replace(/\s+/g, ' ').trim()
  return value.length > limit ? `${value.slice(0, limit)}…` : value
}

/**
 * Render a WeRead recommendation score.
 *
 * The service reports `newRating` on a 0–1000 scale and its own UI shows the
 * same number as a 0–100% recommendation.
 */
function formatRating(rating) {
  const value = Number(rating)
  if (!Number.isFinite(value)) return undefined
  return value > 100 ? `推荐值 ${(value / 10).toFixed(1)}%` : `推荐值 ${value}%`
}

/**
 * Register every WeRead tool on the host context.
 * @param ctx - host plugin context whose `tools` service is available.
 * @param service - the shared WeRead service.
 */
export function registerTools(ctx, service) {
  ctx.effect(() => {
    const disposers = []
    defineTools(ctx, service, (definition) => {
      const dispose = registerIfFree(ctx, definition)
      if (typeof dispose === 'function') disposers.push(dispose)
    })
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'weread: tools')
}

/**
 * Register a tool only when the name is still free.
 */
function registerIfFree(ctx, definition) {
  try {
    const existing =
      typeof ctx.tools.get === 'function'
        ? ctx.tools.get(definition.name)
        : typeof ctx.tools.has === 'function' && ctx.tools.has(definition.name)
    if (existing) {
      ctx.logger?.info('[weread] skip tool %s: already registered', definition.name)
      return () => {}
    }
  } catch {
    // Fall through and let register throw if the name is taken.
  }
  try {
    return ctx.tools.register(definition)
  } catch (error) {
    ctx.logger?.info('[weread] skip tool %s: %s', definition.name, error?.message ?? error)
    return () => {}
  }
}

/**
 * Build the four advertised tool definitions.
 * @param ctx - host plugin context.
 * @param service - the shared WeRead service.
 * @param keep - receives each finished definition.
 */
function defineTools(ctx, service, keep) {
  keep({
    name: 'weread_shelf',
    description:
      '列出用户的微信读书书架，按最近阅读时间排序。未登录时返回演示书。当用户问「我的书架」「我最近读什么」时使用。',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        limit: { type: 'integer', description: '最多返回多少条，默认 30。' },
        refresh: { type: 'boolean', description: '跳过缓存强制刷新，默认 false。' },
      },
    },
    output: OUTPUT,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const shelf = await service.shelf({ refresh: args?.refresh === true, signal: exec.signal })
      const limit = Number.isFinite(args?.limit) ? Math.max(1, Math.min(200, args.limit)) : 30
      const items = [...shelf.books, ...(shelf.albums ?? [])]
        .sort((left, right) => (right.readUpdateTime ?? 0) - (left.readUpdateTime ?? 0))
        .slice(0, limit)
      const header = shelf.demo
        ? `当前是演示模式（未登录），书架展示 ${items.length} 本演示书：`
        : `书架共 ${shelf.totalCount} 项，展示 ${items.length} 项：`
      const lines = items.map((item, index) => {
        const parts = [`${index + 1}. 《${item.title}》`]
        if (item.author) parts.push(`— ${item.author}`)
        if (item.finishReading) parts.push('[已读完]')
        if (item.readUpdateDate) parts.push(`(最近 ${item.readUpdateDate})`)
        parts.push(`bookId=${item.bookId}`)
        return parts.join(' ')
      })
      return result([header, ...lines].join('\n'), {
        demo: shelf.demo === true,
        totalCount: shelf.totalCount,
        items,
      })
    },
  })

  keep({
    name: 'weread_search',
    description:
      '在微信读书书城搜索书籍，返回书名、作者、评分与 bookId。当用户想找一本书、或需要把书名解析成 bookId 时使用。',
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['keyword'],
      properties: {
        keyword: { type: 'string', description: '搜索关键词（书名、作者、主题）。' },
        count: { type: 'integer', description: '返回数量，默认 10。' },
      },
    },
    output: OUTPUT,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const found = await service.search(args?.keyword, {
        count: Number.isFinite(args?.count) ? Math.max(1, Math.min(50, args.count)) : 10,
        signal: exec.signal,
      })
      const lines = [`「${found.keyword}」找到 ${found.count} 个结果：`]
      for (const [index, item] of found.results.entries()) {
        const parts = [`${index + 1}. 《${item.title}》`]
        if (item.author) parts.push(`— ${item.author}`)
        const rating = formatRating(item.rating)
        if (rating !== undefined) parts.push(rating)
        parts.push(`bookId=${item.bookId}`)
        lines.push(parts.join(' '))
        if (item.intro) lines.push(`   简介：${clip(item.intro, 120)}`)
      }
      return result(lines.join('\n'), found)
    },
  })

  keep({
    name: 'weread_book',
    description:
      '查看一本微信读书书籍的详情、阅读进度与章节目录。可以传书名或 bookId。',
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['book'],
      properties: {
        book: { type: 'string', description: '书名或微信读书 bookId。' },
      },
    },
    output: OUTPUT,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const bookId = await service.resolveBookId(args?.book, { signal: exec.signal })
      const detail = await service.book(bookId, { signal: exec.signal })
      const lines = [
        `《${detail.title}》${detail.author ? ` — ${detail.author}` : ''}`,
        detail.intro ? clip(detail.intro, 200) : undefined,
        detail.progress ? `阅读进度：${detail.progress.progress ?? 0}%` : undefined,
        `共 ${detail.chapters?.length ?? 0} 章`,
        `bookId=${detail.bookId}`,
      ].filter((line) => line !== undefined)
      const catalog = (detail.chapters ?? []).slice(0, 20)
      if (catalog.length > 0) {
        lines.push('', '目录：')
        for (const chapter of catalog) {
          lines.push(`- ${chapter.title} (chapterUid=${chapter.chapterUid})`)
        }
        if (detail.chapters.length > catalog.length) {
          lines.push(`…其余 ${detail.chapters.length - catalog.length} 章已省略`)
        }
      }
      return result(lines.join('\n'), detail)
    },
  })

  keep({
    name: 'weread_chapter',
    description:
      '读取一本微信读书书籍某一章的正文（纯文本段落）。未登录时只能读演示书。可以传书名或 bookId，以及 chapterUid 或章节标题。',
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['book'],
      properties: {
        book: { type: 'string', description: '书名或微信读书 bookId。' },
        chapterUid: { type: 'integer', description: '章节 chapterUid。省略则读当前进度章或第一章。' },
        chapter: { type: 'string', description: '章节标题（当未提供 chapterUid 时用于匹配）。' },
      },
    },
    output: OUTPUT,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const bookId = await service.resolveBookId(args?.book, { signal: exec.signal })
      const catalog = await service.chapterCatalog(bookId, { signal: exec.signal })
      let uid = Number(args?.chapterUid)
      if (!Number.isFinite(uid) || uid <= 0) {
        const title = typeof args?.chapter === 'string' ? args.chapter.trim() : ''
        const matched = title.length > 0 ? catalog.find((chapter) => chapter.title.includes(title)) : undefined
        uid = matched?.chapterUid ?? catalog.find((chapter) => (chapter.wordCount ?? 0) > 0)?.chapterUid ?? catalog[0]?.chapterUid
      }
      const chapter = await service.chapter(bookId, uid, { signal: exec.signal })
      const body = (chapter.paragraphs ?? []).join('\n\n')
      const lines = [
        `《章节》${chapter.title}`,
        `第 ${chapter.chapterIdx + 1}/${chapter.chapterCount} 章`,
        '',
        clip(body, 4000),
      ]
      return result(lines.join('\n'), {
        bookId: chapter.bookId,
        chapterUid: chapter.chapterUid,
        title: chapter.title,
        chapterIdx: chapter.chapterIdx,
        chapterCount: chapter.chapterCount,
        paragraphCount: chapter.paragraphs?.length ?? 0,
        demo: chapter.demo === true,
      })
    },
  })
}

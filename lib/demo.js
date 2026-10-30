/**
 * Demo book shown when the user has not signed in yet.
 *
 * Original short text written for this plugin so the sidebar reader still has
 * something to open in an empty session.
 */

export const DEMO_BOOK_ID = 'dsh-weread-demo'

export const DEMO_BOOK = {
  bookId: DEMO_BOOK_ID,
  title: '在 DSH 里读书（演示）',
  author: 'dsh-weread',
  cover: '',
  category: '演示',
  intro: '未登录时的演示书：介绍扫码登录、书架与侧边栏阅读器。登录微信读书后会被真实书架替换。',
  readUpdateTime: Date.now(),
  readUpdateDate: new Date().toISOString().slice(0, 10),
  finishReading: false,
  secret: false,
  kind: 'book',
  demo: true,
}

export const DEMO_CHAPTERS = [
  {
    chapterUid: 1,
    chapterIdx: 1,
    title: '欢迎',
    level: 1,
    wordCount: 180,
    paragraphs: [
      '这是 dsh-weread 的演示书。',
      '右侧栏可以浏览书架、搜索书城，并在面板里直接读章节。未登录时你会看到这本书，方便先熟悉界面。',
      '登录方式有两种：用微信扫码，或粘贴已登录 weread.qq.com 的 Cookie（须含 wr_vid 与 wr_skey）。',
    ],
  },
  {
    chapterUid: 2,
    chapterIdx: 2,
    title: '如何登录',
    level: 1,
    wordCount: 220,
    paragraphs: [
      '打开「设置」，点击「开始扫码」。手机微信扫描二维码并确认后，宿主会保存会话 Cookie。',
      '也可以从浏览器开发者工具复制 weread.qq.com 的完整 Cookie 头，粘贴到设置里保存。',
      'Cookie 只保存在本机 ~/.dsh/storages/weread/，权限 0600，只发给 weread.qq.com。',
    ],
  },
  {
    chapterUid: 3,
    chapterIdx: 3,
    title: '阅读与工具',
    level: 1,
    wordCount: 210,
    paragraphs: [
      '登录后，「在读」会显示最近在读的书，「书架」列出全部藏书，「书城」可以搜索。',
      '点「在 DSH 里读」会打开章节阅读器：可调字号、目录、方向键或左右点击翻页。',
      'Agent 可调用 weread_shelf、weread_search、weread_book、weread_chapter。若这些名字已被 weread-export 占用，本插件会跳过注册，侧边栏与 /api/weread 仍然可用。',
    ],
  },
]

/** True when the id is the in-plugin demo book. */
export function isDemoBook(bookId) {
  return String(bookId ?? '') === DEMO_BOOK_ID
}

/** One demo chapter, or undefined. */
export function demoChapter(chapterUid) {
  const uid = Number(chapterUid)
  return DEMO_CHAPTERS.find((chapter) => chapter.chapterUid === uid)
}

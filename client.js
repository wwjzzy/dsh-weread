/**
 * dsh-weread — client half.
 *
 * A right-sidebar tab type ("微信读书") with its guide entry, rendering four
 * views: 在读 / 书架 / 笔记 / 设置. Every value comes from the host half over
 * the plugin's own `/weread` channel, so the panel and the agent tools read
 * the same state.
 *
 * The browser artifact is the hand-written loader format DSH expects: a
 * factory registered under the package name, with `react` taken from the
 * page's module table.
 */

window.__ModuleLoader__.load({
  id: 'dsh-weread',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** Identity of this tab type; also the key its body registers under. */
    const TAB_ID = 'dsh-weread'
    /** The kind a caller names to open this page. */
    const TAB_KIND = 'weread'
    /** The sidebar tab kind the shipped Browser plugin registers. */
    const BROWSER_KIND = 'browser'
    /** Where a user collects an agent API key. */
    const API_KEY_URL = 'https://weread.qq.com/r/weread-skills'

    const CSS = [
      '.wr-root{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}',
      '.wr-tabs{display:flex;align-items:center;gap:2px;padding:6px;border-bottom:.5px solid var(--dsw-alias-border-l1);flex:none}',
      '.wr-tab{border:0;background:transparent;color:var(--dsw-alias-label-secondary);padding:3px 9px;border-radius:var(--dsw-radius-sm,6px);cursor:pointer;font:inherit;font-size:12px}',
      '.wr-tab:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.wr-tab[data-active="true"]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.wr-spacer{flex:auto}',
      '.wr-icon{width:22px;height:22px;padding:0;display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:var(--dsw-alias-label-secondary);border-radius:var(--dsw-radius-sm,6px);cursor:pointer}',
      '.wr-icon:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '::highlight(weread-kept){background-color:rgba(255,196,0,.38);color:inherit}',
      '.wr-body{flex:auto;min-height:0;overflow:auto;padding:10px}',
      '.wr-muted{color:var(--dsw-alias-label-secondary)}',
      '.wr-faint{color:var(--dsw-alias-label-secondary);font-size:11px}',
      '.wr-card{border:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-md,8px);padding:10px 12px;margin-bottom:8px;background:var(--dsw-alias-bg-layer-2)}',
      '.wr-title{margin:0 0 2px;font-weight:600;font-size:14px;line-height:20px}',
      '.wr-row{display:flex;gap:10px;align-items:flex-start}',
      '.wr-cover{width:46px;height:62px;object-fit:cover;border-radius:var(--dsw-radius-xs,4px);flex:none;background:var(--dsw-alias-bg-layer-1)}',
      '.wr-coverFlat{width:46px;height:62px;border-radius:var(--dsw-radius-xs,4px);flex:none;background:var(--dsw-alias-bg-layer-1)}',
      '.wr-progress{height:4px;border-radius:2px;background:var(--dsw-alias-bg-layer-1);overflow:hidden;margin:7px 0 4px}',
      '.wr-progressFill{height:100%;background:var(--dsw-alias-brand-primary)}',
      '.wr-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}',
      '.wr-btn{border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:var(--dsw-radius-sm,6px);padding:3px 10px;font:inherit;font-size:12px;cursor:pointer}',
      '.wr-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.wr-btnPrimary{border-color:transparent;background:var(--dsw-alias-brand-primary);color:#fff}',
      '.wr-btnPrimary:hover{opacity:.9;background:var(--dsw-alias-brand-primary)}',
      '.wr-input{width:100%;box-sizing:border-box;background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm,6px);color:var(--dsw-alias-label-primary);padding:5px 8px;font:inherit;font-size:12px}',
      '.wr-input:focus{outline:1px solid var(--dsw-alias-brand-primary);outline-offset:-1px}',
      '.wr-field{margin-bottom:8px}',
      '.wr-label{display:block;margin-bottom:4px;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.wr-error{color:var(--dsw-alias-state-error-primary);font-size:12px;margin:6px 0 0;white-space:pre-wrap;word-break:break-word}',
      '.wr-ok{color:var(--dsw-alias-state-success-primary);font-size:12px;margin:6px 0 0}',
      '.wr-warn{color:var(--dsw-alias-state-warn-primary);font-size:12px;margin:6px 0 0}',
      '.wr-list{list-style:none;margin:0;padding:0}',
      '.wr-item{padding:8px 10px;border-radius:var(--dsw-radius-sm,6px);cursor:pointer;border:.5px solid transparent}',
      '.wr-item:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.wr-quote{margin:6px 0;padding-left:9px;border-left:2px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary)}',
      '.wr-thought{margin:6px 0;padding:6px 9px;border-radius:var(--dsw-radius-sm,6px);background:var(--dsw-alias-bg-layer-2)}',
      '.wr-chapter{margin:14px 0 6px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}',
      '.wr-empty{padding:26px 14px;text-align:center;color:var(--dsw-alias-label-secondary)}',
      '.wr-steps{margin:6px 0 0;padding-left:18px;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.wr-steps li{margin:3px 0}',
      '.wr-sep{height:.5px;background:var(--dsw-alias-border-l1);margin:10px 0}',
      '.wr-tag{display:inline-block;padding:0 5px;border-radius:var(--dsw-radius-xs,4px);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font-size:11px;margin-left:5px}',
      '.wr-preview{white-space:pre-wrap;word-break:break-word;max-height:84px;overflow:hidden}',
      '.wr-toggle{display:flex;align-items:center;gap:7px;margin-top:8px;font-size:12px;cursor:pointer;color:var(--dsw-alias-label-primary)}',
      '.wr-toggle input{accent-color:var(--dsw-alias-brand-primary);cursor:pointer}',
      '.wr-reader{display:flex;flex-direction:column;height:100%;min-height:0}',
      '.wr-readerBar{display:flex;align-items:center;gap:4px;padding:6px 8px;border-bottom:.5px solid var(--dsw-alias-border-l1);flex:none;flex-wrap:wrap}',
      '.wr-readerMeta{font-size:11px;color:var(--dsw-alias-label-secondary);flex:auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.wr-readerBody{flex:auto;min-height:0;overflow:auto;padding:16px 18px 48px}',
      '.wr-readerText{white-space:pre-wrap;word-break:break-word;color:inherit}',
      '.wr-theme-follow{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base)}',
      '.wr-theme-light{background:#ffffff;color:#1c1c1e}',
      '.wr-theme-dark{background:#15171a;color:#c9ced3}',
      '.wr-theme-sepia{background:#f7f1e3;color:#3b3226}',
      '.wr-appearance{display:flex;flex-wrap:wrap;align-items:center;gap:5px;padding:6px 10px;border-bottom:.5px solid var(--dsw-alias-border-l1);flex:none}',
      '.wr-appearanceLabel{font-size:11px;color:var(--dsw-alias-label-secondary);margin-left:2px}',
      '.wr-chip{border:.5px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:999px;padding:1px 8px;font-size:11px;font-family:inherit;cursor:pointer}',
      '.wr-chip:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.wr-chip[data-on="true"]{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}',
      '.wr-readerText p{margin:0 0 .95em}',
      '.wr-catalog{max-height:46%;overflow:auto;border-bottom:.5px solid var(--dsw-alias-border-l1);flex:none;padding:6px}',
      '.wr-catalogItem{padding:4px 8px;border-radius:var(--dsw-radius-sm,6px);cursor:pointer;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.wr-catalogItem:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.wr-catalogItem[data-active="true"]{color:var(--dsw-alias-brand-primary)}',
      '.wr-qr{width:180px;height:180px;margin:8px auto;display:block;background:#fff;padding:8px;border-radius:8px}',
      '.wr-qr svg{width:100%;height:100%;display:block}',
      '.wr-banner{display:flex;align-items:center;gap:8px;padding:8px 10px;margin:8px 10px 0;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-state-warn-bg,rgba(180,120,20,.12));color:var(--dsw-alias-state-warn-primary);font-size:12px}',
      '.wr-bannerActions{margin-left:auto;flex:none}',
      '.wr-filters{display:flex;align-items:center;gap:4px;margin-bottom:10px;flex-wrap:wrap}',
      '.wr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:12px 8px;padding:2px 0 12px}',
      '.wr-coverCard{display:flex;flex-direction:column;gap:6px;cursor:pointer;border:0;background:transparent;padding:0;text-align:left;color:inherit;font:inherit}',
      '.wr-coverCard:hover .wr-coverHero{box-shadow:0 6px 16px rgba(0,0,0,.18)}',
      '.wr-coverHero{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:4px 6px 6px 4px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 1px 4px rgba(0,0,0,.12);display:block}',
      '.wr-coverHeroFlat{width:100%;aspect-ratio:3/4;border-radius:4px 6px 6px 4px;background:linear-gradient(165deg,var(--dsw-alias-bg-layer-2),var(--dsw-alias-bg-layer-1));box-shadow:0 1px 4px rgba(0,0,0,.08)}',
      '.wr-coverMeta{min-width:0}',
      '.wr-coverTitle{font-size:11px;line-height:14px;font-weight:600;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.wr-continue{padding:14px 14px 12px}',
      '.wr-continueCover{width:72px;height:96px;object-fit:cover;border-radius:4px 8px 8px 4px;flex:none;background:var(--dsw-alias-bg-layer-1);box-shadow:0 4px 12px rgba(0,0,0,.16)}',
      '.wr-continueCoverFlat{width:72px;height:96px;border-radius:4px 8px 8px 4px;flex:none;background:var(--dsw-alias-bg-layer-1)}',
      '.wr-dock{flex:none;padding:6px 10px 10px;border-top:.5px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base)}',
      '.wr-dockRow{display:flex;align-items:center;gap:8px;margin-top:4px}',
    ].join('')

    // --- shared helpers ------------------------------------------------------

    /** One human-readable line for any thrown value. */
    function errorText(error) {
      if (error === null || error === undefined) return '未知错误'
      if (typeof error.message === 'string' && error.message.length > 0) return error.message
      return String(error)
    }

    /**
     * Call one host operation over the plugin's own `/api/weread` route.
     * The route carries a result envelope, so a business failure arrives as a
     * value and a carrier failure as a throw; both become one Error here.
     */
    async function callRemote(ctx, endpoint, payload, signal) {
      let response
      try {
        response = await fetch('/api/weread', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ endpoint, payload: payload || {} }),
          signal,
        })
      } catch (error) {
        throw new Error(`与宿主插件通信失败：${errorText(error)}`)
      }
      if (!response.ok) {
        throw new Error(
          response.status === 401 || response.status === 403
            ? '宿主插件拒绝了这次请求（浏览器会话未通过鉴权），请重新加载页面。'
            : `宿主插件返回 HTTP ${response.status}。`,
        )
      }
      let result
      try {
        result = await response.json()
      } catch {
        throw new Error('宿主插件返回了无法解析的响应。')
      }
      if (result !== null && result !== undefined && result.ok === true) return result.value
      const info = (result && result.error) || {}
      const failure = new Error(info.message || '宿主插件没有返回结果。')
      failure.code = info.code || 'weread/transport'
      throw failure
    }

    /** Run an async loader with loading/ready/error state and a manual reload. */
    function useLoader(loader, deps) {
      const [state, setState] = React.useState({ status: 'loading' })
      const [nonce, setNonce] = React.useState(0)
      const latest = React.useRef(loader)
      latest.current = loader
      const keys = deps === undefined ? [nonce] : [...deps, nonce]
      React.useEffect(() => {
        let cancelled = false
        setState((previous) => (previous.status === 'ready' ? previous : { status: 'loading' }))
        Promise.resolve()
          .then(() => latest.current())
          .then(
            (value) => {
              if (!cancelled) setState({ status: 'ready', value })
            },
            (error) => {
              if (!cancelled) setState({ status: 'error', error })
            },
          )
        return () => {
          cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, keys)
      const reload = React.useCallback(() => setNonce((value) => value + 1), [])
      return [state, reload]
    }

    /**
     * Reading appearance, mirrored from the host.
     *
     * These live in the plugin's own settings file rather than page storage,
     * so they survive an app restart and follow the profile.
     */
    const APPEARANCE_FALLBACK = { theme: 'follow', fontSize: 17, lineHeight: 1.9, fontFamily: 'system' }
    const THEME_LABELS = [
      ['follow', '跟随 DSH'],
      ['light', '浅色'],
      ['dark', '深色'],
      ['sepia', '羊皮纸'],
    ]
    const LINE_LABELS = [
      [1.5, '紧'],
      [1.9, '标准'],
      [2.3, '松'],
    ]
    const FAMILY_LABELS = [
      ['system', '默认'],
      ['serif', '宋体'],
      ['sans', '黑体'],
    ]
    const FAMILY_STACKS = {
      system: 'inherit',
      serif: "'Songti SC', 'SimSun', Georgia, serif",
      sans: "'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif",
    }

    /** Progress bar with a numeric label. */
    function Progress(props) {
      const value = Math.max(0, Math.min(100, Number(props.value) || 0))
      return h(
        'div',
        null,
        h('div', { className: 'wr-progress' }, h('div', { className: 'wr-progressFill', style: { width: `${value}%` } })),
        h('div', { className: 'wr-faint' }, `阅读进度 ${value}%${props.hint ? ` · ${props.hint}` : ''}`),
      )
    }

    /** A cover that degrades to a flat block when the image cannot load. */
    function Cover(props) {
      const [failed, setFailed] = React.useState(false)
      const imageClass = props.variant === 'hero' ? 'wr-coverHero' : props.variant === 'continue' ? 'wr-continueCover' : 'wr-cover'
      const flatClass = props.variant === 'hero' ? 'wr-coverHeroFlat' : props.variant === 'continue' ? 'wr-continueCoverFlat' : 'wr-coverFlat'
      if (typeof props.src !== 'string' || props.src.length === 0 || failed) {
        return h('div', { className: flatClass })
      }
      return h('img', {
        className: imageClass,
        src: props.src,
        alt: '',
        loading: 'lazy',
        referrerPolicy: 'no-referrer',
        onError: () => setFailed(true),
      })
    }

    /**
     * Render a WeRead recommendation score: the service reports 0–1000 and
     * its own UI shows the same number as a 0–100% recommendation.
     */
    function formatRating(rating) {
      const value = Number(rating)
      if (!Number.isFinite(value)) return undefined
      return value > 100 ? `推荐值 ${(value / 10).toFixed(1)}%` : `推荐值 ${value}%`
    }

    /**
     * Turn the paragraph layout into a fraction of the chapter's text.
     *
     * The server derives the stored percentage from the reported position
     * rather than from the percentage we send, so the position is the part
     * worth getting right: a linear scroll fraction is badly wrong whenever
     * paragraphs differ in length, which in a Chinese book they always do.
     *
     * @param scrollTop - how far the reading surface is scrolled.
     * @param boxes - `{ top, height, start, length }` per paragraph, in order.
     */
    function measurePosition(scrollTop, boxes) {
      if (!Array.isArray(boxes) || boxes.length === 0) return 0
      let total = 0
      for (const box of boxes) total += box.length || 0
      if (total <= 0) return 0
      let chars = 0
      for (const box of boxes) {
        const height = box.height || 0
        const length = box.length || 0
        if (height > 0 && scrollTop < box.top + height) {
          const inside = scrollTop <= box.top ? 0 : (scrollTop - box.top) / height
          chars = box.start + length * Math.min(1, inside)
          break
        }
        chars = box.start + length
      }
      return Math.min(1, Math.max(0, chars / total))
    }

    /**
     * A reader that has not touched the page for this long is not reading.
     */
    const READING_IDLE_MS = 60_000
    /** Report accumulated reading time once this much has built up. */
    const READING_FLUSH_SECONDS = 120
    /** Below this, an automatic flush is not worth an account write. */
    const READING_MIN_SECONDS = 30
    /** How often the visible counter refreshes. */
    const READING_DISPLAY_MS = 15_000

    /**
     * Credit reading time for one tick.
     *
     * Wall-clock time is not reading time: the panel stays mounted while you
     * work elsewhere, and an open tab is not attention. WeRead's own reader
     * reports the same `rt` field, so a tick counts only when the page is
     * visible and the reader interacted inside the idle window.
     *
     * Pure, so the accounting is testable without timers or a DOM.
     *
     * @param state - `{ activeSeconds, lastCountedAt, lastInteractionAt }`.
     * @param now - the current clock.
     * @param visible - whether the page is visible.
     */
    function creditReadingTime(state, now, visible) {
      const elapsed = (now - state.lastCountedAt) / 1000
      const attentive = now - state.lastInteractionAt <= READING_IDLE_MS
      const credited = visible && attentive && elapsed > 0 ? elapsed : 0
      return { ...state, activeSeconds: state.activeSeconds + credited, lastCountedAt: now }
    }

    /**
     * Whether the reader is actually on screen.
     *
     * A mounted view is not a viewed one: DSH keeps this tab mounted while you
     * work elsewhere, so `document.visibilityState` stays "visible" and the
     * page keeps reporting interaction. Without this check the book accrues
     * reading time for as long as the tab is open.
     *
     * @param element - the reading surface.
     * @param viewport - the current viewport height.
     */
    function isOnScreen(element, viewport) {
      if (element === null || element === undefined) return false
      // A `display: none` ancestor leaves the element with no client rects.
      if (typeof element.getClientRects === 'function' && element.getClientRects().length === 0) return false
      if (typeof element.getBoundingClientRect !== 'function') return false
      const rect = element.getBoundingClientRect()
      if (!rect || rect.width <= 0 || rect.height <= 0) return false
      if (!(viewport > 0)) return false
      return rect.bottom > 0 && rect.top < viewport
    }

    /**
     * Which chapter a book should open at.
     *
     * Local and cloud positions are compared by recency. A report that has
     * not landed yet still wins, so reopening a book does not jump backwards.
     *
     * @param positions - remembered positions, keyed by book id.
     * @param bookId - the book being opened.
     * @param progress - WeRead's own progress record, or a chapterUid number.
     * @param firstUid - the first chapter with real text, as a last resort.
     */
    function resumeChapterUid(positions, bookId, progress, firstUid) {
      const remembered = positions === undefined || positions === null ? undefined : positions[String(bookId)]
      const localUid = remembered === undefined || remembered === null ? 0 : Number(remembered.chapterUid)
      const localAt = remembered === undefined || remembered === null ? 0 : Number(remembered.updatedAt) || 0
      const cloud =
        progress !== null && typeof progress === 'object'
          ? progress
          : Number.isFinite(Number(progress)) && Number(progress) > 0
            ? { chapterUid: Number(progress) }
            : undefined
      const cloudUid = Number(cloud?.chapterUid) || 0
      const cloudAt = (Number(cloud?.updateTime) || 0) * 1000
      if (localUid > 0 && (cloudUid <= 0 || localAt > cloudAt)) return localUid
      if (cloudUid > 0) return cloudUid
      return Number.isFinite(firstUid) && firstUid > 0 ? firstUid : 0
    }

    /** Seconds → a short Chinese duration label. */
    function formatReadingTime(seconds) {
      const value = Math.max(0, Math.floor(Number(seconds) || 0))
      if (value < 60) return value > 0 ? `${value} 秒` : ''
      const minutes = Math.round(value / 60)
      if (minutes < 60) return `${minutes} 分钟`
      const hours = Math.floor(minutes / 60)
      const rest = minutes % 60
      return rest > 0 ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`
    }

    /** True when the panel should offer a one-tap re-login. */
    function isSessionError(error) {
      const code = error && error.code
      return code === 'weread/session-expired' || code === 'weread/needs-cookie'
    }

    /** The first chapter with real text: catalogs open with 封面/版权 entries. */
    function firstReadableChapterUid(chapters) {
      if (!Array.isArray(chapters) || chapters.length === 0) return 0
      const readable = chapters.find((chapter) => Number(chapter.wordCount) > 0)
      return (readable ?? chapters[0]).chapterUid
    }

    /** Standard loading / error / empty frame for one view. */
    function Loaded(props) {
      if (props.state.status === 'loading') {
        return h('div', { className: 'wr-empty' }, '正在读取微信读书数据…')
      }
      if (props.state.status === 'error') {
        const error = props.state.error
        const code = error && error.code
        const sessionExpired = code === 'weread/session-expired'
        const needsConfig =
          code === 'weread/needs-config' ||
          code === 'weread/bad-api-key' ||
          (code === 'weread/needs-cookie' && typeof props.onRelogin !== 'function')
        return h(
          'div',
          { className: 'wr-card' },
          h('div', { className: 'wr-title' }, sessionExpired ? '登录已过期' : needsConfig ? '还没有配置微信读书' : '读取失败'),
          h('p', { className: 'wr-error' }, errorText(error)),
          needsConfig
            ? h(
                'ol',
                { className: 'wr-steps' },
                h('li', null, '打开「设置」，用微信扫码登录'),
                h('li', null, '或粘贴已登录 weread.qq.com 的 Cookie'),
                h('li', null, '回到「在读」即可看到书架与进度'),
              )
            : null,
          h(
            'div',
            { className: 'wr-actions' },
            sessionExpired && typeof props.onRelogin === 'function'
              ? h('button', { className: 'wr-btn wr-btnPrimary', onClick: props.onRelogin }, '重新登录')
              : null,
            h('button', { className: 'wr-btn', onClick: props.reload }, '重试'),
          ),
        )
      }
      return props.render(props.state.value)
    }

    /** Setup instructions shown whenever credentials are missing. */
    function SetupHint(props) {
      return h(
        'div',
        { className: 'wr-card' },
        h('div', { className: 'wr-title' }, '让 DSH 连上你的微信读书'),
        h(
          'ol',
          { className: 'wr-steps' },
          h('li', null, '打开「设置」，用微信扫描二维码并确认'),
          h('li', null, '或从浏览器复制 weread.qq.com 的 Cookie（须含 wr_vid 与 wr_skey）'),
          h('li', null, '未登录时可以先读演示书，熟悉阅读器'),
        ),
        h(
          'div',
          { className: 'wr-actions' },
          h('button', { className: 'wr-btn wr-btnPrimary', onClick: props.onGoSettings }, '去设置'),
        ),
        h('p', { className: 'wr-faint' }, 'Cookie 只保存在本机，只发给 weread.qq.com。'),
      )
    }

    // --- 在读 -----------------------------------------------------------------

    function NowView(props) {
      const [state, reload] = useLoader(async () => {
        const current = await props.wrCall('current')
        if (current === null || current === undefined || current.book === undefined) {
          return { current: null }
        }
        let detail = null
        try {
          detail = await props.wrCall('book', { bookId: current.book.bookId })
        } catch {
          // The shelf entry is enough to render; book detail only adds links.
        }
        return { current, detail }
      })
      return h(
        'div',
        { className: 'wr-body' },
        h(
          Loaded,
          {
            state,
            reload,
            onRelogin: props.onRelogin,
            render: (value) =>
              value.current === null
                ? h(
                    'div',
                    { className: 'wr-empty' },
                    '书架上还没有在读的书。',
                    h(
                      'div',
                      { className: 'wr-actions', style: { justifyContent: 'center' } },
                      h('button', { className: 'wr-btn', onClick: () => props.wrGoShelf() }, '打开书架'),
                    ),
                  )
                : h(NowCard, {
                    data: value,
                    wrOpenReader: props.wrOpenReader,
                    wrGoNotes: props.wrGoNotes,
                    onRead: props.onRead,
                    readerReady: props.readerReady,
                    positions: props.positions,
                    reload,
                  }),
          },
        ),
      )
    }

    function NowCard(props) {
      const { current, detail } = props.data
      const book = current.book
      const progress = current.progress
      const readerLink = detail === null || detail === undefined ? undefined : detail.readerLink
      const deepLink = detail === null || detail === undefined ? undefined : detail.deepLink
      const reading = progress !== undefined && progress !== null ? progress : undefined
      const chapters = detail !== null && detail !== undefined ? detail.chapters : []
      const firstChapterUid = firstReadableChapterUid(chapters)
      const chapterUid = resumeChapterUid(props.positions, book.bookId, reading, firstChapterUid)
      const canReadInPanel = props.readerReady === true && chapterUid > 0
      const timeLabel = formatReadingTime(reading !== undefined ? reading.recordReadingTime : book.readingTime)
      return h(
        'div',
        { className: 'wr-card wr-continue' },
        h(
          'div',
          { className: 'wr-row' },
          h(Cover, {
            src: detail !== null && detail !== undefined && detail.cover ? detail.cover : book.cover,
            variant: 'continue',
          }),
          h(
            'div',
            { style: { minWidth: 0, flex: 'auto' } },
            h('div', { className: 'wr-faint' }, '继续阅读'),
            h('h3', { className: 'wr-title' }, `《${book.title}》`),
            book.author.length > 0 ? h('div', { className: 'wr-faint' }, book.author) : null,
            h(Progress, {
              value: reading !== undefined ? reading.progress : book.progress || 0,
              hint: [book.readUpdateDate !== undefined ? `上次 ${book.readUpdateDate}` : undefined, timeLabel ? `累计 ${timeLabel}` : undefined]
                .filter(Boolean)
                .join(' · '),
            }),
          ),
        ),
        h(
          'div',
          { className: 'wr-actions' },
          canReadInPanel
            ? h(
                'button',
                {
                  className: 'wr-btn wr-btnPrimary',
                  onClick: () => props.onRead({ bookId: book.bookId, chapterUid, firstChapterUid, title: book.title }),
                },
                '继续阅读',
              )
            : null,
          readerLink !== undefined
            ? h(
                'button',
                { className: canReadInPanel ? 'wr-btn' : 'wr-btn wr-btnPrimary', onClick: () => props.wrOpenReader(readerLink) },
                '官方阅读器',
              )
            : h(
                'button',
                { className: 'wr-btn', onClick: () => props.wrOpenReader('https://weread.qq.com/') },
                '打开微信读书',
              ),
          deepLink !== undefined
            ? h('button', { className: 'wr-btn', onClick: () => props.wrOpenReader(deepLink) }, '书籍详情')
            : null,
          h('button', { className: 'wr-btn', onClick: () => props.wrGoNotes(book) }, '看划线'),
          h('button', { className: 'wr-btn', onClick: props.reload }, '刷新'),
        ),
        h(
          'p',
          { className: 'wr-faint' },
          canReadInPanel
            ? '「在 DSH 里读」直接在侧边栏渲染正文；「官方阅读器」在 DSH 内置浏览器里打开微信读书官方页面。'
            : '登录后即可在侧边栏里直接读正文。未登录时可以打开演示书。',
        ),
      )
    }

    // --- 书架 -----------------------------------------------------------------

    function ShelfView(props) {
      const [selected, setSelected] = React.useState(null)
      const [state, reload] = useLoader(() => props.wrCall('shelf', { refresh: props.refresh === true }))
      if (selected !== null) {
        return h(BookDetail, {
          book: selected,
          wrCall: props.wrCall,
          wrOpenReader: props.wrOpenReader,
          onOpenNotes: props.onOpenNotes,
          onRead: props.onRead,
          readerReady: props.readerReady,
          positions: props.positions,
          onRelogin: props.onRelogin,
          onBack: () => setSelected(null),
        })
      }
      return h(
        'div',
        { className: 'wr-body' },
        h(Loaded, {
          state,
          reload,
          onRelogin: props.onRelogin,
          render: (shelf) => h(ShelfList, { shelf, onSelect: setSelected, reload }),
        }),
      )
    }

    function ShelfList(props) {
      const shelf = props.shelf
      const [filter, setFilter] = React.useState('all')
      const [layout, setLayout] = React.useState('cover')
      if (shelf === null || shelf === undefined) return h('div', { className: 'wr-empty' }, '书架为空。')
      const books = shelf.books.slice().sort((left, right) => right.readUpdateTime - left.readUpdateTime)
      const albums = shelf.albums
      const visible =
        filter === 'finished'
          ? books.filter((book) => book.finishReading === true)
          : filter === 'reading'
            ? books.filter((book) => book.finishReading !== true)
            : books
      const filters = [
        ['all', '全部', books.length],
        ['reading', '在读', books.filter((book) => book.finishReading !== true).length],
        ['finished', '已读完', books.filter((book) => book.finishReading === true).length],
      ]
      const renderMeta = (book) => {
        const timeLabel = formatReadingTime(book.readingTime)
        const bits = []
        if (Number.isFinite(Number(book.progress))) bits.push(`${Math.round(book.progress)}%`)
        if (timeLabel) bits.push(timeLabel)
        if (book.readUpdateDate !== undefined) bits.push(book.readUpdateDate)
        return bits.join(' · ')
      }
      return h(
        'div',
        null,
        h(
          'div',
          { className: 'wr-filters' },
          filters.map(([id, label, count]) =>
            h(
              'button',
              { key: id, className: 'wr-chip', 'data-on': String(filter === id), onClick: () => setFilter(id) },
              `${label} ${count}`,
            ),
          ),
          h('div', { className: 'wr-spacer' }),
          h(
            'button',
            {
              className: 'wr-icon',
              title: layout === 'cover' ? '列表' : '封面',
              onClick: () => setLayout((value) => (value === 'cover' ? 'list' : 'cover')),
            },
            layout === 'cover'
              ? h(
                  'svg',
                  { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, 'aria-hidden': true },
                  h('path', { d: 'M3 5h10M3 11h10' }),
                )
              : h(
                  'svg',
                  { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, 'aria-hidden': true },
                  h('rect', { x: 2.5, y: 2.5, width: 4.5, height: 4.5, rx: 0.8 }),
                  h('rect', { x: 9, y: 2.5, width: 4.5, height: 4.5, rx: 0.8 }),
                  h('rect', { x: 2.5, y: 9, width: 4.5, height: 4.5, rx: 0.8 }),
                  h('rect', { x: 9, y: 9, width: 4.5, height: 4.5, rx: 0.8 }),
                ),
          ),
          h('button', { className: 'wr-btn', onClick: props.reload }, '刷新'),
        ),
        visible.length === 0
          ? h('div', { className: 'wr-empty' }, filter === 'finished' ? '还没有读完的书。' : '这一栏是空的。')
          : layout === 'cover'
            ? h(
                'div',
                { className: 'wr-grid' },
                visible.map((book) =>
                  h(
                    'button',
                    { key: book.bookId, className: 'wr-coverCard', onClick: () => props.onSelect(book) },
                    h(Cover, { src: book.cover, variant: 'hero' }),
                    h(
                      'div',
                      { className: 'wr-coverMeta' },
                      h('div', { className: 'wr-coverTitle' }, book.title),
                      h('div', { className: 'wr-faint' }, renderMeta(book) || book.author),
                    ),
                  ),
                ),
              )
            : h(
                'ul',
                { className: 'wr-list' },
                visible.map((book) =>
                  h(
                    'li',
                    { key: book.bookId, className: 'wr-item', onClick: () => props.onSelect(book) },
                    h(
                      'div',
                      { className: 'wr-row' },
                      h(Cover, { src: book.cover }),
                      h(
                        'div',
                        { style: { minWidth: 0, flex: 'auto' } },
                        h('div', { style: { fontWeight: 600 } }, book.title, book.finishReading ? h('span', { className: 'wr-tag' }, '已读完') : null),
                        book.author.length > 0 ? h('div', { className: 'wr-faint' }, book.author) : null,
                        h('div', { className: 'wr-faint' }, renderMeta(book)),
                        Number.isFinite(Number(book.progress))
                          ? h('div', { className: 'wr-progress' }, h('div', { className: 'wr-progressFill', style: { width: `${Math.max(0, Math.min(100, book.progress))}%` } }))
                          : null,
                      ),
                    ),
                  ),
                ),
              ),
        albums.length > 0 && filter === 'all'
          ? h(
              'div',
              null,
              h('div', { className: 'wr-sep' }),
              h('div', { className: 'wr-faint' }, '有声书 / 专辑'),
              h(
                'ul',
                { className: 'wr-list' },
                albums.map((album) =>
                  h(
                    'li',
                    { key: album.bookId, className: 'wr-item' },
                    h('div', { style: { fontWeight: 600 } }, album.title),
                    h('div', { className: 'wr-faint' }, `${album.author}${album.trackCount > 0 ? ` · ${album.trackCount} 集` : ''}`),
                  ),
                ),
              ),
            )
          : null,
      )
    }

    function BookDetail(props) {
      const [state, reload] = useLoader(() => props.wrCall('book', { bookId: props.book.bookId }))
      return h(
        'div',
        { className: 'wr-body' },
        h('button', { className: 'wr-btn', onClick: props.onBack }, '← 返回书架'),
        h('div', { style: { height: 8 } }),
        h(Loaded, {
          state,
          reload,
          onRelogin: props.onRelogin,
          render: (detail) =>
            h(
              'div',
              { className: 'wr-card' },
              h(
                'div',
                { className: 'wr-row' },
                h(Cover, { src: detail.cover || props.book.cover }),
                h(
                  'div',
                  { style: { minWidth: 0, flex: 'auto' } },
                  h('h3', { className: 'wr-title' }, `《${detail.title || props.book.title}》`),
                  h('div', { className: 'wr-faint' }, detail.author || props.book.author),
                  formatRating(detail.rating) !== undefined
                    ? h('div', { className: 'wr-faint' }, formatRating(detail.rating))
                    : null,
                  detail.wordCount > 0
                    ? h('div', { className: 'wr-faint' }, `约 ${Math.round(detail.wordCount / 10000)} 万字`)
                    : null,
                  detail.progress !== undefined && detail.progress !== null
                    ? h(Progress, { value: detail.progress.progress })
                    : null,
                ),
              ),
              h(
                'div',
                { className: 'wr-actions' },
                (() => {
                  const firstChapterUid = firstReadableChapterUid(detail.chapters)
                  const chapterUid = resumeChapterUid(props.positions, props.book.bookId, detail.progress, firstChapterUid)
                  if (props.readerReady !== true || chapterUid <= 0) return null
                  return h(
                    'button',
                    {
                      className: 'wr-btn wr-btnPrimary',
                      onClick: () =>
                        props.onRead({
                          bookId: props.book.bookId,
                          chapterUid,
                          firstChapterUid,
                          title: detail.title || props.book.title,
                        }),
                    },
                    '在 DSH 里读',
                  )
                })(),
                detail.readerLink !== undefined
                  ? h('button', { className: 'wr-btn', onClick: () => props.wrOpenReader(detail.readerLink) }, '官方阅读器')
                  : null,
                detail.deepLink !== undefined
                  ? h('button', { className: 'wr-btn', onClick: () => props.wrOpenReader(detail.deepLink) }, '书籍详情')
                  : null,
                h(
                  'button',
                  {
                    className: 'wr-btn',
                    onClick: () => props.onOpenNotes({ bookId: props.book.bookId, title: detail.title || props.book.title }),
                  },
                  '看划线',
                ),
              ),
              detail.intro.length > 0 ? h('div', { className: 'wr-sep' }) : null,
              detail.intro.length > 0 ? h('div', { className: 'wr-preview wr-muted' }, detail.intro) : null,
              detail.chapters.length > 0
                ? h('div', { className: 'wr-faint', style: { marginTop: 8 } }, `目录共 ${detail.chapters.length} 章`)
                : null,
            ),
        }),
      )
    }

    // --- 笔记 -----------------------------------------------------------------

    function NotesView(props) {
      const initial = props.initialBook === undefined ? null : props.initialBook
      const [selected, setSelected] = React.useState(initial)
      const [state, reload] = useLoader(() => props.wrCall('notebooks'))
      if (selected !== null) {
        return h(NotesDetail, { book: selected, wrCall: props.wrCall, onBack: () => setSelected(null), onRelogin: props.onRelogin })
      }
      return h(
        'div',
        { className: 'wr-body' },
        h(Loaded, {
          state,
          reload,
          onRelogin: props.onRelogin,
          render: (value) =>
            value.books.length === 0
              ? h('div', { className: 'wr-empty' }, '还没有任何划线或笔记。')
              : h(
                  'div',
                  null,
                  h(
                    'div',
                    { className: 'wr-faint', style: { marginBottom: 8 } },
                    `${value.totalBookCount} 本书 · ${value.totalNoteCount} 条笔记（划线 + 想法 + 书签）`,
                  ),
                  h(
                    'ul',
                    { className: 'wr-list' },
                    value.books.map((book) =>
                      h(
                        'li',
                        { key: book.bookId, className: 'wr-item', onClick: () => setSelected(book) },
                        h(
                          'div',
                          { className: 'wr-row' },
                          h(Cover, { src: book.cover }),
                          h(
                            'div',
                            { style: { minWidth: 0, flex: 'auto' } },
                            h('div', { style: { fontWeight: 600 } }, `《${book.title}》`),
                            book.author.length > 0 ? h('div', { className: 'wr-faint' }, book.author) : null,
                            h(
                              'div',
                              { className: 'wr-faint' },
                              `划线 ${book.noteCount} · 想法 ${book.reviewCount} · 书签 ${book.bookmarkCount} · 进度 ${book.readingProgress}%`,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
        }),
      )
    }

    function NotesDetail(props) {
      const [state, reload] = useLoader(() => props.wrCall('notes', { bookId: props.book.bookId }))
      return h(
        'div',
        { className: 'wr-body' },
        h('button', { className: 'wr-btn', onClick: props.onBack }, '← 返回笔记列表'),
        h('div', { style: { height: 8 } }),
        h(Loaded, {
          state,
          reload,
          onRelogin: props.onRelogin,
          render: (value) =>
            value.chapters.length === 0
              ? h('div', { className: 'wr-empty' }, '这本书里没有找到划线或想法。')
              : h(
                  'div',
                  null,
                  h('div', { className: 'wr-faint' }, `${value.highlightCount} 条划线 · ${value.thoughtCount} 条想法`),
                  value.chapters.map((chapter) =>
                    h(
                      'div',
                      { key: chapter.chapterUid || chapter.chapterTitle },
                      h('div', { className: 'wr-chapter' }, chapter.chapterTitle || '未归类'),
                      chapter.highlights.map((highlight, index) =>
                        h('div', { key: `h${index}`, className: 'wr-quote' }, highlight.text),
                      ),
                      chapter.thoughts.map((thought, index) =>
                        h(
                          'div',
                          { key: `t${index}`, className: 'wr-thought' },
                          h('div', null, thought.content),
                          thought.abstract.length > 0
                            ? h('div', { className: 'wr-faint' }, `原文：${thought.abstract}`)
                            : null,
                        ),
                      ),
                    ),
                  ),
                ),
        }),
      )
    }

    // --- 阅读器 ---------------------------------------------------------------

    function ReaderView(props) {
      const { wrCall, bookId, bookTitle, syncEnabled, onBack, onAppearance, onChapter } = props
      const [chapterUid, setChapterUid] = React.useState(props.chapterUid)
      const [appearance, setAppearance] = React.useState(() => ({
        ...APPEARANCE_FALLBACK,
        ...(props.readerSettings ?? {}),
      }))
      const [showCatalog, setShowCatalog] = React.useState(false)
      const [showAppearance, setShowAppearance] = React.useState(false)
      const [message, setMessage] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const [chapterRatio, setChapterRatio] = React.useState(0)
      // How far through the chapter the reader has scrolled. The host turns
      // this into the book's own position units, because it owns the catalog.
      // A ref, not state: scrolling must not re-render the whole chapter.
      const positionRef = React.useRef({ chapterUid: props.chapterUid, ratio: 0 })
      const bodyRef = React.useRef(null)
      const paragraphRefs = React.useRef([])
      const layoutRef = React.useRef({ at: 0, boxes: [] })
      // Reading-time accounting: only attentive, visible time counts.
      const readingRef = React.useRef({
        activeSeconds: 0,
        lastCountedAt: Date.now(),
        lastInteractionAt: Date.now(),
      })
      const [activeSeconds, setActiveSeconds] = React.useState(0)
      const summaryRef = React.useRef('')
      const flushRef = React.useRef(null)
      const lastChapterRef = React.useRef(props.chapterUid)
      const [state, reload] = useLoader(() => wrCall('chapter', { bookId, chapterUid }), [bookId, chapterUid])

      React.useEffect(() => {
        // Leaving a chapter reports what was read in it, at its own position,
        // before the position ref moves on.
        if (lastChapterRef.current !== chapterUid) {
          void flushRef.current?.(false)
          lastChapterRef.current = chapterUid
          if (typeof onChapter === 'function') onChapter(chapterUid)
          positionRef.current = { chapterUid, ratio: 0 }
          readingRef.current = { ...readingRef.current, lastCountedAt: Date.now() }
          if (bodyRef.current !== null) bodyRef.current.scrollTop = 0
        }
        setMessage(null)
        layoutRef.current = { at: 0, boxes: [] }
        paragraphRefs.current = []
      }, [chapterUid, appearance.fontSize, appearance.lineHeight, appearance.fontFamily])

      // The chapter text is only needed as a short "where you are" summary.
      React.useEffect(() => {
        summaryRef.current =
          state.status === 'ready' && state.value.paragraphs.length > 0
            ? state.value.paragraphs[0].slice(0, 20)
            : ''
      }, [state])

      /**
       * Report the position, carrying whatever reading time has built up.
       *
       * The manual button forces a report; the timer, a chapter change and
       * leaving the reader only send once the time is worth an account write.
       */
      const report = async (force) => {
        const seconds = Math.floor(readingRef.current.activeSeconds)
        if (!force && seconds < READING_MIN_SECONDS) return undefined
        const { chapterUid: uid, ratio } = positionRef.current
        readingRef.current = { ...readingRef.current, activeSeconds: 0, lastCountedAt: Date.now() }
        try {
          return await wrCall('reportProgress', {
            bookId,
            chapterUid: uid,
            positionRatio: ratio,
            summary: summaryRef.current,
            elapsedSeconds: seconds,
          })
        } catch (error) {
          // Hand the time back so a later report can retry it.
          readingRef.current = { ...readingRef.current, activeSeconds: readingRef.current.activeSeconds + seconds }
          throw error
        }
      }
      flushRef.current = report

      // The accounting ticker, plus the interaction and visibility it needs.
      React.useEffect(() => {
        if (syncEnabled !== true) return undefined
        const interact = () => {
          readingRef.current = { ...readingRef.current, lastInteractionAt: Date.now() }
        }
        const tick = () => {
          const now = Date.now()
          // Reading time belongs to the book you are looking at, not to the
          // app being open: the tab stays mounted while you work elsewhere.
          const watching = isOnScreen(bodyRef.current, window.innerHeight || 0)
          const next = creditReadingTime(readingRef.current, now, watching && document.visibilityState === 'visible')
          readingRef.current = next
          if (next.activeSeconds >= READING_FLUSH_SECONDS) void flushRef.current?.(false).catch(() => {})
        }
        const events = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll']
        for (const type of events) document.addEventListener(type, interact, { capture: true, passive: true })
        const ticks = setInterval(tick, 1000)
        const display = setInterval(() => setActiveSeconds(Math.floor(readingRef.current.activeSeconds)), READING_DISPLAY_MS)
        return () => {
          clearInterval(ticks)
          clearInterval(display)
          for (const type of events) document.removeEventListener(type, interact, { capture: true })
          // Leaving the reader keeps what was read rather than dropping it.
          void flushRef.current?.(false).catch(() => {})
        }
      }, [syncEnabled])

      /** Measure each paragraph's box, in the reading surface's coordinates. */
      const measureLayout = () => {
        const element = bodyRef.current
        if (element === null) return []
        const containerTop = element.getBoundingClientRect().top
        const boxes = []
        for (const node of paragraphRefs.current) {
          if (node === null || node === undefined) continue
          const rect = node.getBoundingClientRect()
          boxes.push({
            top: rect.top - containerTop + element.scrollTop,
            height: rect.height,
            start: Number(node.dataset.start),
            length: Number(node.dataset.length),
          })
        }
        return boxes
      }

      /** Report how far through the chapter's text the reader actually is. */
      const trackPosition = () => {
        const element = bodyRef.current
        if (element === null) return
        readingRef.current = { ...readingRef.current, lastInteractionAt: Date.now() }
        const stamp = Date.now()
        if (layoutRef.current.boxes.length === 0 || stamp - layoutRef.current.at > 250) {
          layoutRef.current = { at: stamp, boxes: measureLayout() }
        }
        const ratio = measurePosition(element.scrollTop, layoutRef.current.boxes)
        positionRef.current = { chapterUid, ratio }
        setChapterRatio(ratio)
      }

      // The host is the source of truth; this only mirrors it back in, so a
      // saved appearance applies as soon as the status read lands.
      React.useEffect(() => {
        if (props.readerSettings !== undefined) {
          setAppearance({ ...APPEARANCE_FALLBACK, ...props.readerSettings })
        }
      }, [props.readerSettings])

      /** Apply one appearance change locally at once, then persist it. */
      const updateAppearance = (patch) => {
        const next = { ...appearance, ...patch }
        setAppearance(next)
        if (typeof onAppearance === 'function') onAppearance(next)
      }

      const changeFont = (delta) => {
        updateAppearance({ fontSize: Math.max(12, Math.min(30, appearance.fontSize + delta)) })
      }

      const sync = async () => {
        setBusy(true)
        setMessage(null)
        const seconds = Math.floor(readingRef.current.activeSeconds)
        try {
          const value = await report(true)
          setMessage({
            kind: 'ok',
            text: `已上报：进度按本地估算 ${value.progress}%，阅读时长 ${Math.max(1, Math.round(seconds / 60))} 分钟（面板显示的进度是官方数值；最终以微信读书为准）。`,
          })
          setActiveSeconds(0)
        } catch (error) {
          setMessage({ kind: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }

      const value = state.status === 'ready' ? state.value : undefined
      const readLabel =
        syncEnabled === true && activeSeconds >= 60 ? ` · 本次已读 ${Math.round(activeSeconds / 60)} 分钟` : ''
      const meta =
        value === undefined
          ? `《${bookTitle}》`
          : `《${bookTitle || value.bookId}》 · ${value.title}${value.chapterIdx >= 0 ? `（${value.chapterIdx + 1}/${value.chapterCount}）` : ''}${readLabel}`

      const turnPage = (direction) => {
        const element = bodyRef.current
        if (element === null) return
        const page = Math.max(80, Math.floor(element.clientHeight * 0.92))
        if (direction > 0) {
          if (element.scrollTop + element.clientHeight >= element.scrollHeight - 12) {
            if (value !== undefined && value.next !== undefined) setChapterUid(value.next.chapterUid)
            return
          }
          element.scrollBy({ top: page, behavior: 'smooth' })
        } else {
          if (element.scrollTop <= 12) {
            if (value !== undefined && value.previous !== undefined) setChapterUid(value.previous.chapterUid)
            return
          }
          element.scrollBy({ top: -page, behavior: 'smooth' })
        }
      }

      React.useEffect(() => {
        const onKey = (event) => {
          const tag = event.target && event.target.tagName
          if (tag === 'INPUT' || tag === 'TEXTAREA') return
          if (event.target && (event.target.isContentEditable || (event.target.closest && event.target.closest('[contenteditable="true"]')))) return
          if (document.activeElement && (document.activeElement.isContentEditable || ['INPUT','TEXTAREA'].includes(document.activeElement.tagName))) return
          if (event.key === 'ArrowRight' || event.key === ' ') {
            event.preventDefault()
            turnPage(1)
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault()
            turnPage(-1)
          }
        }
        document.addEventListener('keydown', onKey)
        // [patch] 记住用户在正文里选中的文字：切到聊天框时浏览器会清除选区，
        // 所以必须在选区还在时把它存到宿主，供 weread_selection 工具读取。
        let selTimer = null
        const onSelection = () => {
          let text = ''
          try {
            const sel = typeof document.getSelection === 'function' ? document.getSelection() : null
            text = sel === null ? '' : String(sel.toString() || '')
          } catch {
            text = ''
          }
          const trimmed = text.trim()
          if (trimmed.length < 2) return
          // [patch] 选区一旦失焦就被浏览器清掉；用 CSS Custom Highlight 另画一层
          // 持久高亮，视觉上"选中还在"，用户切到输入框打字时能看到自己选的是哪段。
          try {
            // 注意：本文件第 30 行有一个局部常量也叫 CSS（样式字符串数组），
            // 直接写 CSS.highlights 会被它遮蔽，必须走 globalThis。
            const g = typeof globalThis !== 'undefined' ? globalThis : undefined
            const cssApi = g === undefined ? undefined : g.CSS
            const HighlightCtor = g === undefined ? undefined : g.Highlight
            const win = g === undefined ? undefined : g.window
            if (cssApi !== undefined && cssApi !== null && cssApi.highlights && typeof HighlightCtor === 'function' && win && win.getSelection) {
              const live = win.getSelection()
              if (live !== null && live.rangeCount > 0 && !live.isCollapsed) {
                cssApi.highlights.set('weread-kept', new HighlightCtor(live.getRangeAt(0).cloneRange()))
              }
            }
          } catch {
            /* Highlight API 不可用时静默降级 */
          }
          if (selTimer !== null) clearTimeout(selTimer)
          selTimer = setTimeout(() => {
            selTimer = null
            void props
              .wrCall('selection', {
                text: trimmed.slice(0, 4000),
                chapterTitle: value && value.title ? String(value.title) : '',
                chapterUid: value && Number.isFinite(value.chapterUid) ? value.chapterUid : 0,
                bookId: value && value.bookId ? String(value.bookId) : '',
              })
              .catch(() => {})
          }, 350)
        }
        document.addEventListener('selectionchange', onSelection)
        return () => {
          document.removeEventListener('keydown', onKey)
          document.removeEventListener('selectionchange', onSelection)
          if (selTimer !== null) clearTimeout(selTimer)
        }
      }, [chapterUid, state.status, value && value.next && value.next.chapterUid, value && value.previous && value.previous.chapterUid])

      const chapterPercent = Math.round(Math.max(0, Math.min(1, chapterRatio)) * 100)
      const bookPercent =
        value !== undefined && value.chapterCount > 0
          ? Math.round(((Math.max(0, value.chapterIdx) + chapterRatio) / value.chapterCount) * 100)
          : 0

      return h(
        'div',
        { className: 'wr-reader' },
        h(
          'div',
          { className: 'wr-readerBar' },
          h('button', { className: 'wr-btn', onClick: onBack }, '←'),
          h(
            'button',
            {
              className: 'wr-btn',
              disabled: value === undefined || value.previous === undefined,
              onClick: () => value !== undefined && value.previous !== undefined && setChapterUid(value.previous.chapterUid),
            },
            '上一章',
          ),
          h(
            'button',
            {
              className: 'wr-btn',
              disabled: value === undefined || value.next === undefined,
              onClick: () => value !== undefined && value.next !== undefined && setChapterUid(value.next.chapterUid),
            },
            '下一章',
          ),
          h('button', { className: 'wr-btn', onClick: () => setShowCatalog((shown) => !shown) }, '目录'),
          h('button', { className: 'wr-btn', onClick: () => setShowAppearance((shown) => !shown) }, '外观'),
          h('div', { className: 'wr-spacer' }),
          h('button', { className: 'wr-btn', title: '减小字号', onClick: () => changeFont(-1) }, 'A-'),
          h('button', { className: 'wr-btn', title: '增大字号', onClick: () => changeFont(1) }, 'A+'),
          syncEnabled ? h('button', { className: 'wr-btn', disabled: busy, onClick: sync }, busy ? '同步中…' : '同步进度') : null,
        ),
        h('div', { className: 'wr-readerMeta', style: { padding: '4px 10px' } }, meta),
        showCatalog && value !== undefined
          ? h(CatalogList, {
              chapters: value.chapters,
              activeUid: chapterUid,
              onPick: (uid) => {
                setChapterUid(uid)
                setShowCatalog(false)
              },
            })
          : null,
        showAppearance
          ? h(
              'div',
              { className: 'wr-appearance' },
              h('span', { className: 'wr-appearanceLabel' }, '主题'),
              THEME_LABELS.map(([id, label]) =>
                h(
                  'button',
                  { key: id, className: 'wr-chip', 'data-on': String(appearance.theme === id), onClick: () => updateAppearance({ theme: id }) },
                  label,
                ),
              ),
              h('span', { className: 'wr-appearanceLabel' }, '行距'),
              LINE_LABELS.map(([value_, label]) =>
                h(
                  'button',
                  { key: label, className: 'wr-chip', 'data-on': String(appearance.lineHeight === value_), onClick: () => updateAppearance({ lineHeight: value_ }) },
                  label,
                ),
              ),
              h('span', { className: 'wr-appearanceLabel' }, '字体'),
              FAMILY_LABELS.map(([id, label]) =>
                h(
                  'button',
                  { key: id, className: 'wr-chip', 'data-on': String(appearance.fontFamily === id), onClick: () => updateAppearance({ fontFamily: id }) },
                  label,
                ),
              ),
            )
          : null,
        h(
          'div',
          {
            ref: bodyRef,
            onScroll: trackPosition,
            className: `wr-readerBody wr-theme-${appearance.theme}`,
            style: {
              fontSize: `${appearance.fontSize}px`,
              lineHeight: appearance.lineHeight,
              fontFamily: FAMILY_STACKS[appearance.fontFamily] ?? 'inherit',
            },
            onClick: (event) => {
              const selection = typeof window.getSelection === 'function' ? String(window.getSelection()) : ''
              if (selection.length > 0) return
              const rect = event.currentTarget.getBoundingClientRect()
              const x = (event.clientX - rect.left) / rect.width
              if (x < 0.28) turnPage(-1)
              else if (x > 0.72) turnPage(1)
            },
          },
          h(Loaded, {
            state,
            reload,
            onRelogin: props.onRelogin,
            render: (chapter) => {
              if (chapter.paragraphs.length === 0) {
                return h('div', { className: 'wr-empty' }, '这一章没有可显示的正文。')
              }
              let cursor = 0
              const offsets = chapter.paragraphs.map((paragraph) => {
                const start = cursor
                cursor += paragraph.length
                return start
              })
              return h(
                'div',
                { className: 'wr-readerText' },
                chapter.paragraphs.map((paragraph, index) =>
                  h(
                    'p',
                    {
                      key: index,
                      ref: (node) => {
                        paragraphRefs.current[index] = node
                      },
                      'data-start': offsets[index],
                      'data-length': paragraph.length,
                    },
                    paragraph,
                  ),
                ),
              )
            },
          }),
        ),
        h(
          'div',
          { className: 'wr-dock' },
          h(
            'div',
            { className: 'wr-progress' },
            h('div', { className: 'wr-progressFill', style: { width: `${chapterPercent}%` } }),
          ),
          h(
            'div',
            { className: 'wr-dockRow' },
            h(
              'div',
              { className: 'wr-faint' },
              value === undefined
                ? '本章'
                : `本章 ${chapterPercent}% · 全书约 ${bookPercent}%${value.chapterIdx >= 0 ? ` · ${value.chapterIdx + 1}/${value.chapterCount}` : ''}`,
            ),
            h('div', { className: 'wr-spacer' }),
            h('span', { className: 'wr-faint' }, '← → / 空格翻页'),
          ),
        ),
        message !== null
          ? h('p', { className: message.kind === 'ok' ? 'wr-ok' : 'wr-error', style: { padding: '0 10px 8px' } }, message.text)
          : null,
      )
    }

    /** The chapter list the reader jumps through. */
    function CatalogList(props) {
      return h(
        'div',
        { className: 'wr-catalog' },
        props.chapters.map((chapter) =>
          h(
            'div',
            {
              key: chapter.chapterUid,
              className: 'wr-catalogItem',
              'data-active': String(chapter.chapterUid === props.activeUid),
              onClick: () => props.onPick(chapter.chapterUid),
            },
            chapter.title || `第 ${chapter.chapterIdx + 1} 章`,
          ),
        ),
      )
    }

    // --- 设置 -----------------------------------------------------------------

    function SearchView(props) {
      const [keyword, setKeyword] = React.useState('')
      const [submitted, setSubmitted] = React.useState('')
      const [selected, setSelected] = React.useState(null)
      const [state, reload] = useLoader(
        () => (submitted.length === 0 ? Promise.resolve({ keyword: '', count: 0, results: [] }) : props.wrCall('search', { keyword: submitted, count: 20 })),
        [submitted],
      )
      if (selected !== null) {
        return h(BookDetail, {
          book: selected,
          wrCall: props.wrCall,
          wrOpenReader: props.wrOpenReader,
          onOpenNotes: props.onOpenNotes,
          onRead: props.onRead,
          onRelogin: props.onRelogin,
          readerReady: props.readerReady,
          positions: props.positions,
          onBack: () => setSelected(null),
        })
      }
      return h(
        'div',
        { className: 'wr-body' },
        h(
          'div',
          { className: 'wr-field' },
          h('input', {
            className: 'wr-input',
            value: keyword,
            placeholder: '搜索书名、作者…',
            onChange: (event) => setKeyword(event.target.value),
            onKeyDown: (event) => {
              if (event.key === 'Enter' && keyword.trim().length > 0) setSubmitted(keyword.trim())
            },
          }),
        ),
        h(
          'div',
          { className: 'wr-actions' },
          h(
            'button',
            {
              className: 'wr-btn wr-btnPrimary',
              onClick: () => keyword.trim().length > 0 && setSubmitted(keyword.trim()),
            },
            '搜索',
          ),
        ),
        submitted.length === 0
          ? h('div', { className: 'wr-empty' }, '在书城搜索一本书，点开后可看目录或在侧边栏阅读。')
          : h(Loaded, {
              state,
              reload,
              onRelogin: props.onRelogin,
              render: (found) =>
                found.results.length === 0
                  ? h('div', { className: 'wr-empty' }, `「${found.keyword}」没有结果。`)
                  : h(
                      'ul',
                      { className: 'wr-list' },
                      found.results.map((item) =>
                        h(
                          'li',
                          {
                            key: item.bookId,
                            className: 'wr-item',
                            onClick: () => setSelected(item),
                          },
                          h('div', { className: 'wr-title' }, `《${item.title}》`),
                          h('div', { className: 'wr-faint' }, [item.author, formatRating(item.rating)].filter(Boolean).join(' · ')),
                        ),
                      ),
                    ),
            }),
      )
    }

    const API_KEY_HELP_URL = 'https://weread.qq.com/r/weread-skills'

    function SettingsView(props) {
      const [state, reload] = useLoader(() => props.wrCall('status'))
      const [cookie, setCookie] = React.useState('')
      const [apiKey, setApiKey] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [message, setMessage] = React.useState(null)
      const [qr, setQr] = React.useState(null)
      const status = state.status === 'ready' ? state.value : undefined
      const autoQr = props.autoQr === true

      const run = async (operation) => {
        setBusy(true)
        setMessage(null)
        try {
          setMessage({ kind: 'ok', text: await operation() })
        } catch (error) {
          setMessage({ kind: 'error', text: errorText(error) })
        } finally {
          setBusy(false)
        }
      }

      const startQr = () =>
        run(async () => {
          const started = await props.wrCall('qrStart')
          setQr(started)
          void Promise.resolve(props.wrCall('qrComplete', { uid: started.uid }))
            .then(() => {
              setQr(null)
              reload()
              setMessage({ kind: 'ok', text: '扫码登录成功。' })
            })
            .catch((error) => {
              setMessage({ kind: 'error', text: errorText(error) })
            })
          return '请用微信扫描下方二维码。'
        })

      const save = () => {
        if (cookie.trim().length === 0) {
          setMessage({ kind: 'error', text: '请先粘贴 Cookie。' })
          return
        }
        return run(async () => {
          await props.wrCall('configure', { cookie: cookie.trim() })
          setCookie('')
          reload()
          return '已保存 Cookie。'
        })
      }

      const saveApiKey = () => {
        const value = apiKey.trim()
        if (value.length === 0) {
          setMessage({ kind: 'error', text: '请先粘贴 API Key。' })
          return
        }
        if (!value.startsWith('wrk-')) {
          setMessage({ kind: 'error', text: 'API Key 应以 wrk- 开头。' })
          return
        }
        return run(async () => {
          await props.wrCall('configure', { apiKey: value })
          setApiKey('')
          reload()
          return '已保存 API Key。'
        })
      }

      const logout = () =>
        run(async () => {
          await props.wrCall('logout')
          setQr(null)
          reload()
          return '已退出登录，回到演示模式。'
        })

      const toggleSync = (value) =>
        run(async () => {
          await props.wrCall('configure', { syncProgress: value })
          reload()
          return value ? '已开启进度回写。' : '已关闭进度回写。'
        })

      React.useEffect(() => {
        if (autoQr !== true || qr !== null || busy) return undefined
        startQr()
        if (typeof props.onAutoQrConsumed === 'function') props.onAutoQrConsumed()
        return undefined
      }, [autoQr])

      return h(
        'div',
        { className: 'wr-body' },
        h(
          'div',
          { className: 'wr-card' },
          h('h3', { className: 'wr-title' }, '连接状态'),
          state.status === 'loading'
            ? h('div', { className: 'wr-faint' }, '读取中…')
            : state.status === 'error'
              ? h('p', { className: 'wr-error' }, errorText(state.error))
              : h(
                  'ul',
                  { className: 'wr-list' },
                  h('li', { className: 'wr-faint' }, `登录：${status.cookieConfigured ? '已登录' : '未登录（演示模式）'}`),
                  status.cookieConfigured
                    ? h('li', { className: 'wr-faint' }, `Cookie：${status.cookieNames.join(', ')}`)
                    : null,
                  h(
                    'li',
                    { className: 'wr-faint' },
                    `API Key：${status.apiKeyConfigured ? `已配置 ${status.apiKeyHint}${status.apiKeyLooksValid === false ? '（格式可疑）' : ''}` : '未配置（只能读正文，读不到划线/想法）'}`,
                  ),
                  h('li', { className: 'wr-faint' }, `数据目录：${status.dataDir}`),
                ),
          h(
            'div',
            { className: 'wr-actions' },
            h('button', { className: 'wr-btn', disabled: busy, onClick: () => reload() }, '刷新状态'),
            status !== undefined && status.cookieConfigured
              ? h('button', { className: 'wr-btn', disabled: busy, onClick: logout }, '退出登录')
              : null,
          ),
        ),
        h(
          'div',
          { className: 'wr-card' },
          h('h3', { className: 'wr-title' }, '微信扫码登录'),
          h('p', { className: 'wr-faint' }, '用微信扫描二维码，在手机上确认后即可同步书架。'),
          h(
            'div',
            { className: 'wr-actions' },
            h('button', { className: 'wr-btn wr-btnPrimary', disabled: busy, onClick: startQr }, busy && qr === null ? '正在生成…' : '开始扫码'),
          ),
          qr !== null
            ? h('div', {
                className: 'wr-qr',
                dangerouslySetInnerHTML: { __html: qr.qrSvg },
              })
            : null,
        ),
        h(
          'div',
          { className: 'wr-card' },
          h('h3', { className: 'wr-title' }, 'API Key（划线 / 想法 / 笔记）'),
          h(
            'p',
            { className: 'wr-faint' },
            '划线、想法与笔记走官方 Agent Gateway，需要单独的 API Key；和上面的扫码登录是两套独立凭据，缺它只能读正文。',
          ),
          h(
            'div',
            { className: 'wr-field' },
            h('input', {
              className: 'wr-input',
              type: 'password',
              value: apiKey,
              placeholder: 'wrk-…',
              spellCheck: false,
              autoComplete: 'off',
              onChange: (event) => setApiKey(event.target.value),
            }),
          ),
          h(
            'div',
            { className: 'wr-actions' },
            h('button', { className: 'wr-btn wr-btnPrimary', disabled: busy, onClick: saveApiKey }, busy ? '保存中…' : '保存 API Key'),
            h(
              'a',
              {
                className: 'wr-btn',
                href: API_KEY_HELP_URL,
                target: '_blank',
                rel: 'noreferrer',
                style: { textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
              },
              '去获取 API Key ↗',
            ),
          ),
          h('p', { className: 'wr-faint' }, `在 ${API_KEY_HELP_URL} 用微信读书账号登录后创建。`),
        ),
        h(
          'div',
          { className: 'wr-card' },
          h('h3', { className: 'wr-title' }, '粘贴 Cookie'),
          h(
            'p',
            { className: 'wr-faint' },
            '从已登录的 weread.qq.com 复制完整 Cookie 头（须含 wr_vid 与 wr_skey）。',
          ),
          h(
            'div',
            { className: 'wr-field' },
            h('textarea', {
              className: 'wr-input',
              rows: 3,
              value: cookie,
              placeholder: 'wr_vid=…; wr_skey=…; wr_rt=…',
              spellCheck: false,
              onChange: (event) => setCookie(event.target.value),
            }),
          ),
          h(
            'div',
            { className: 'wr-actions' },
            h('button', { className: 'wr-btn wr-btnPrimary', disabled: busy, onClick: save }, busy ? '保存中…' : '保存 Cookie'),
          ),
        ),
        h(
          'div',
          { className: 'wr-card' },
          h('h3', { className: 'wr-title' }, '进度回写'),
          h('p', { className: 'wr-faint' }, '打开后，阅读器会把当前章节与阅读时长写回微信读书。'),
          h(
            'label',
            { className: 'wr-toggle' },
            h('input', {
              type: 'checkbox',
              checked: status !== undefined && status.syncProgress === true,
              disabled: busy,
              onChange: (event) => toggleSync(event.target.checked),
            }),
            h('span', null, status !== undefined && status.syncProgress === true ? '已开启' : '已关闭'),
          ),
        ),
        message !== null ? h('p', { className: message.kind === 'ok' ? 'wr-ok' : 'wr-error' }, message.text) : null,
        h('p', { className: 'wr-faint', style: { marginTop: 10 } }, '凭据以 0600 权限保存在本机，只发给 weread.qq.com。'),
      )
    }

    // --- 面板 -----------------------------------------------------------------

    function WereadTab(props) {
      const remoteCall = props.wrCall
      const wrOpenReader = props.wrOpenReader
      const [view, setView] = React.useState('now')
      const [notesBook, setNotesBook] = React.useState(undefined)
      const [nonce, setNonce] = React.useState(0)
      const [reader, setReader] = React.useState(null)
      const [sessionExpired, setSessionExpired] = React.useState(false)
      const [autoQr, setAutoQr] = React.useState(false)
      // Mirrors the host's remembered positions, so opening a book resumes it
      // even before the next status read lands.
      const [positions, setPositions] = React.useState({})
      const wrCall = React.useCallback(
        async (endpoint, payload, signal) => {
          try {
            const value = await remoteCall(endpoint, payload, signal)
            return value
          } catch (error) {
            if (isSessionError(error) && endpoint !== 'status') setSessionExpired(true)
            throw error
          }
        },
        [remoteCall],
      )
      // One local status read decides whether the in-panel reader is offered
      // at all, so the views never show a button that can only fail.
      const [statusState, reloadStatus] = useLoader(() =>
        typeof wrCall === 'function'
          ? wrCall('status')
          : Promise.resolve({ cookieConfigured: false, syncProgress: false }),
      )
      const status = statusState.status === 'ready' ? statusState.value : undefined
      const readerReady =
        status !== undefined && (status.cookieConfigured === true || status.demoMode === true)
      const syncEnabled = status !== undefined && status.syncProgress === true

      const relogin = () => {
        setReader(null)
        setView('settings')
        setAutoQr(true)
        setSessionExpired(false)
      }

      React.useEffect(() => {
        if (status !== undefined && status.positions !== undefined) setPositions(status.positions)
      }, [status])

      /** Remember the chapter a book is open at, here and on the host. */
      const remember = (bookId, chapterUid) => {
        const uid = Number(chapterUid)
        if (!Number.isFinite(uid) || uid <= 0) return
        setPositions({ ...positions, [String(bookId)]: { chapterUid: uid, updatedAt: Date.now() } })
        if (typeof wrCall === 'function') {
          void Promise.resolve(wrCall('rememberPosition', { bookId, chapterUid: uid })).catch(() => {})
        }
      }

      const openNotes = (book) => {
        setNotesBook(book)
        setView('notes')
      }

      /** Persist one reading-appearance change, then re-read the status. */
      const saveAppearance = (next) => {
        if (typeof wrCall !== 'function') return
        Promise.resolve(wrCall('configure', { reader: next }))
          .then(() => reloadStatus())
          .catch(() => {
            // The reader keeps the value it already applied; a failed write
            // only means it will not survive the next open.
          })
      }

      /** Open the in-panel reader at a chapter, or at the book's first one. */
      const openReader = (request) => {
        if (request === null || request === undefined) return
        const chapterUid = Number(request.chapterUid) > 0 ? Number(request.chapterUid) : Number(request.firstChapterUid)
        if (!Number.isFinite(chapterUid) || chapterUid <= 0) return
        remember(request.bookId, chapterUid)
        setReader({ bookId: request.bookId, chapterUid, title: request.title ?? '' })
      }

      const tabs = [
        ['now', '在读'],
        ['shelf', '书架'],
        ['search', '书城'],
        ['notes', '笔记'],
        ['settings', '设置'],
      ]

      if (reader !== null) {
        return h(
          'div',
          { className: 'wr-root' },
          sessionExpired
            ? h(
                'div',
                { className: 'wr-banner' },
                h('span', null, '登录已过期'),
                h(
                  'div',
                  { className: 'wr-bannerActions' },
                  h('button', { className: 'wr-btn wr-btnPrimary', onClick: relogin }, '重新登录'),
                ),
              )
            : null,
          h(ReaderView, {
            wrCall,
            bookId: reader.bookId,
            bookTitle: reader.title,
            chapterUid: reader.chapterUid,
            syncEnabled,
            readerSettings: status === undefined ? undefined : status.reader,
            onAppearance: saveAppearance,
            onChapter: (uid) => remember(reader.bookId, uid),
            onRelogin: relogin,
            onBack: () => setReader(null),
          }),
        )
      }

      let body
      if (typeof remoteCall !== 'function') {
        body = h('div', { className: 'wr-body' }, h('p', { className: 'wr-error' }, '客户端没有拿到宿主通道，请重新加载页面。'))
      } else if (view === 'shelf') {
        body = h(ShelfView, {
          key: `shelf${nonce}`,
          wrCall,
          wrOpenReader,
          onOpenNotes: openNotes,
          onRead: openReader,
          onRelogin: relogin,
          readerReady,
          positions,
          refresh: false,
        })
      } else if (view === 'search') {
        body = h(SearchView, {
          key: `search${nonce}`,
          wrCall,
          wrOpenReader,
          onOpenNotes: openNotes,
          onRead: openReader,
          onRelogin: relogin,
          readerReady,
          positions,
        })
      } else if (view === 'notes') {
        body = h(NotesView, { key: `notes${nonce}`, wrCall, initialBook: notesBook, onRelogin: relogin })
      } else if (view === 'settings') {
        body = h(SettingsView, {
          key: `settings${nonce}`,
          wrCall,
          wrOpenReader,
          autoQr,
          onAutoQrConsumed: () => setAutoQr(false),
        })
      } else {
        body = h(NowView, {
          key: `now${nonce}`,
          wrCall,
          wrOpenReader,
          onRead: openReader,
          onRelogin: relogin,
          readerReady,
          positions,
          wrGoNotes: openNotes,
          wrGoShelf: () => setView('shelf'),
        })
      }

      return h(
        'div',
        { className: 'wr-root' },
        h(
          'div',
          { className: 'wr-tabs' },
          tabs.map(([id, label]) =>
            h('button', { key: id, className: 'wr-tab', 'data-active': String(view === id), onClick: () => setView(id) }, label),
          ),
          h('div', { className: 'wr-spacer' }),
          h(
            'button',
            { className: 'wr-icon', title: '重新加载', onClick: () => setNonce((value) => value + 1) },
            h(
              'svg',
              { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, 'aria-hidden': true },
              h('path', { d: 'M13 8a5 5 0 1 1-1.5-3.5' }),
              h('path', { d: 'M13 2.5V6H9.5' }),
            ),
          ),
        ),
        sessionExpired
          ? h(
              'div',
              { className: 'wr-banner' },
              h('span', null, '登录已过期，书架和阅读需要重新登录。'),
              h(
                'div',
                { className: 'wr-bannerActions' },
                h('button', { className: 'wr-btn wr-btnPrimary', onClick: relogin }, '重新登录'),
              ),
            )
          : null,
        body,
      )
    }

    /** Guide card artwork: an open book. */
    function WereadGuideIcon() {
      return h(
        'svg',
        { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, 'aria-hidden': true },
        h('path', { d: 'M12 6.5C10.4 5.2 8.4 4.6 5.5 4.6v12.9c2.9 0 4.9.6 6.5 1.9 1.6-1.3 3.6-1.9 6.5-1.9V4.6c-2.9 0-4.9.6-6.5 1.9Z' }),
        h('path', { d: 'M12 6.5v12.9' }),
      )
    }

    return {
      inject: ['slots'],
      // The views are exposed for the offline test harness only: the loader
      // reads `inject` and `apply`, and nothing in the page touches this.
      // Without it the views are unreachable — every one of them sits behind a
      // slot body or a loader callback that no test can invoke.
      __views: {
        WereadTab,
        // Pure helpers are exposed here too, so the layout maths is testable
        // without a browser layout engine.
        measurePosition,
        creditReadingTime,
        isOnScreen,
        resumeChapterUid,
        formatReadingTime,
        isSessionError,
        Loaded,
        Progress,
        Cover,
        NowView,
        NowCard,
        ShelfView,
        SearchView,
        ShelfList,
        BookDetail,
        NotesView,
        NotesDetail,
        ReaderView,
        CatalogList,
        SettingsView,
      },
      apply(ctx) {
        // The right-Sidebar face is only readable inside a scope that injected
        // it, so it is captured there rather than read off the plugin context.
        let sidebarRight
        const face = {
          wrCall: (endpoint, payload) => callRemote(ctx, endpoint, payload),
          wrOpenReader: (url) => openInApp(sidebarRight, url),
        }

        // Styles live in one idempotent tag and are removed with the plugin.
        ctx.effect(() => {
          const tagId = 'dsh-weread/panel.css'
          const existing = document.querySelector(`style[data-plugin-css="${tagId}"]`)
          if (existing !== null) {
            existing.textContent = CSS
            return () => {}
          }
          const tag = document.createElement('style')
          tag.dataset.plugin = 'dsh-weread'
          tag.dataset.pluginCss = tagId
          tag.textContent = CSS
          document.head.appendChild(tag)
          return () => {
            tag.remove()
          }
        }, 'dsh-weread: styles')

        // The tab type and its body both wait for the sidebar registry, so
        // activation order never breaks the registration.
        ctx.inject(['sidebarRightTabs', 'sidebarRight'], (scope) => {
          scope.effect(() => {
            sidebarRight = scope.sidebarRight
            return () => {
              sidebarRight = undefined
            }
          }, 'dsh-weread: sidebar face')
          scope.effect(
            () =>
              scope.sidebarRightTabs.register({
                id: TAB_ID,
                kind: TAB_KIND,
                priority: 'extension',
                title: () => '微信读书',
                keepMounted: true,
                guide: [
                  {
                    id: 'open',
                    order: 40,
                    title: () => '微信读书',
                    description: () => '安静封面书架与章节阅读',
                    icon: WereadGuideIcon,
                  },
                ],
              }),
            'dsh-weread: tab type',
          )
        })

        ctx.slots.inject('sidebar.right.pane.tab', () =>
          ctx.slots.register(
            {
              name: 'sidebar.right.pane.tab',
              key: TAB_ID,
              inject: () => face,
            },
            WereadTab,
          ),
        )
      },
    }

    /**
     * Open a URL in the right sidebar's Browser tab, falling back to a new
     * browser tab when that plugin is not mounted (Web profiles ship it off).
     */
    function openInApp(sidebarRight, url) {
      if (typeof url !== 'string' || url.length === 0) return
      try {
        if (sidebarRight !== undefined && typeof sidebarRight.openTab === 'function') {
          sidebarRight.openTab(BROWSER_KIND, { params: { url } })
          return
        }
      } catch {
        // Fall through to the browser's own window.
      }
      try {
        window.open(url, '_blank', 'noopener,noreferrer')
      } catch {
        // Nothing else to try.
      }
    }
  },
})

# dsh-weread

[English](README.md) | [中文](README.zh.md)

WeChat Reading (WeRead) right-sidebar bookshelf and chapter reader for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

## Features

- Right-sidebar panel: bookshelf, store search, prominent Continue card
- Shelf filters (All / Reading / Finished) with progress and reading-time labels
- Cover-first bookshelf, with a list view toggle
- Merges local vs cloud progress by recency; syncs progress and reading time back to WeRead
- Sign in with WeChat QR or Cookie; expired sessions offer a one-tap re-login
- Reader dock with chapter progress and TOC; ←→ / Space / side-click paging
- Demo book when signed out
- Agent tools (registered when the names are free): `weread_shelf`, `weread_search`, `weread_book`, `weread_chapter`

> If [weread-export](https://github.com/zhengjy01/weread-export) is already installed, some tool names may already be taken; this plugin still serves the sidebar UI and `/api/weread`.

## Install

```sh
dsh plugin --profile web add wwjzzy/dsh-weread
```

Or install from a local path / npm once published.

Restart Harness after install, then open the **WeRead** tab in the right sidebar.

## Config

Optional Cordis config (also editable in the panel):

```yaml
cookie: ''            # weread.qq.com Cookie header; leave empty to use QR login or demo mode
syncProgress: false   # write chapter progress and reading time back to WeRead
```

Turn on **进度回写** in Settings to sync while you read. Reports use the same signed `POST /web/book/read` body as the official web reader, with idle detection so an open tab is not counted as reading time.

## License

MIT

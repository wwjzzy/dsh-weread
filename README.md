# dsh-weread

[English](README.md) | [中文](README.zh.md)

WeChat Reading (WeRead) right-sidebar bookshelf and chapter reader for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

## Features

- Right-sidebar panel: bookshelf, store search, resume reading
- Sign in with WeChat QR or by pasting a `weread.qq.com` Cookie
- In-panel chapter reader (font size, TOC, keyboard / side click)
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
cookie: ''   # weread.qq.com Cookie header; leave empty to use QR login or demo mode
```

## License

MIT

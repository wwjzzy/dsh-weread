# dsh-weread

[English](README.md) | [中文](README.zh.md)

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的微信读书右侧栏书架与章节阅读器。

## 功能

- 右侧栏：书架、书城搜索、续读
- 微信扫码登录，或粘贴 `weread.qq.com` 的 Cookie
- 面板内阅读器（字号、目录、方向键 / 左右点击翻页）
- 未登录时提供演示书
- Agent 工具（名称未被占用时注册）：`weread_shelf`、`weread_search`、`weread_book`、`weread_chapter`

> 若已安装 [weread-export](https://github.com/zhengjy01/weread-export)，部分工具名可能已被占用；本插件仍提供右侧栏 UI 与 `/api/weread`。

## 安装

```sh
dsh plugin --profile web add wwjzzy/dsh-weread
```

也可从本地路径或 npm 安装。

安装后重启 Harness，在右侧栏打开 **微信读书** 标签。

## 配置

可选 Cordis 配置（也可在面板里改）：

```yaml
cookie: ''   # weread.qq.com 的 Cookie；留空则用扫码登录或演示模式
```

## 许可证

MIT

# dsh-weread

[English](README.md) | [中文](README.zh.md)

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的微信读书右侧栏书架与章节阅读器。

## 功能

- 右侧栏：书架、书城搜索、醒目的「继续阅读」卡片
- 书架筛选（全部 / 在读 / 已读完），显示进度与阅读时长
- 默认安静封面书架，可切到列表
- 按时间新旧合并本地与云端进度，并把进度和阅读时长写回微信读书
- 微信扫码或 Cookie 登录；会话过期可一键重新登录
- 阅读器底部进度条与目录；←→ / 空格 / 左右点击翻页
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
cookie: ''            # weread.qq.com 的 Cookie；留空则用扫码登录或演示模式
syncProgress: false   # 把章节进度和阅读时长写回微信读书
```

在「设置 → 进度回写」打开后，阅读过程会把进度同步到微信读书。上报走官方网页阅读器同款的签名接口，并且只统计你正在看的时间。

## 许可证

MIT

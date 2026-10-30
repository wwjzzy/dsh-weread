# dsh-weread 上架检查清单（wwjzzy/dsh-weread）

仓库：https://github.com/wwjzzy/dsh-weread  
创建时间：2026-10-30 ≈17:07（北京时间）— **满 1 天后**（约 2026-10-31 17:07 起）CI 的仓库年龄检查才会通过。

## 1. 推送代码

代码已通过本仓库 `main` 发布。不要把 `PUBLISH.md`、`awesome-entry.*`、`wwjzzy__dsh-weread.yml` 当成必须进插件包的文件；YAML 是给 awesome 仓库用的。

然后在仓库 Settings → Topics 加上：`dsh-plugin`。

本地验证：

```sh
dsh plugin --profile web add wwjzzy/dsh-weread
```

## 2. （推荐）市场展示材料

- 放一张 GitHub 托管的 **PNG** 图标（约 180×180），在 YAML 里写 `icon:`。现有 `icon.svg` **不能**用作 awesome 列表的 `icon`。
- 在仓库根放 `screenshots.json`（1–8 张相对路径截图）。

## 3. 向 awesome-dsh-plugin 提 PR

1. Fork https://github.com/awesome-dsh-plugin/awesome-dsh-plugin
2. **只新增一个文件**（不要手改 README）：

   `data/plugins/wwjzzy__dsh-weread.yml`

   内容直接用本目录的 [wwjzzy__dsh-weread.yml](wwjzzy__dsh-weread.yml)。
3. 分类目前是 `ui`；维护者若改成 `tools` 不会因此打回。
4. **等仓库满 1 天再开 PR**，否则 CI 会因 repo age 失败（可过后再推修复，不必重开 PR）。

## 4. 与 weread-export 的关系

- [weread-export](https://github.com/zhengjy01/weread-export) 已在市场（导出划线）。
- 本插件主打 **右侧栏阅读**；工具名冲突时会跳过注册。当前 YAML 措辞已避开「必定提供 4 个工具」这类绝对表述。

## 5. （可选）发 npm

```sh
npm publish
```

`package.json` 的 `repository` 已指向本仓库；**不发也不影响收录**。

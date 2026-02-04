# 第三方工具

## Sherlock – i18n 检查器 (VS Code 扩展)

Sherlock 是一个 VS Code 扩展，可帮助你在代码库中提取、编辑和检查 i18n 键。它可在 [VS Code 市场](https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension) 中找到。

Sherlock 是 inlang 生态系统的一部分，它为你的 i18n 开发提供了多个具有出色开发体验的应用程序，例如 [Figma 插件](https://inlang.com/m/gkrpgoir/app-parrot-figmaPlugin)、[Web 编辑器](https://inlang.com/m/tdozzpar/app-inlang-finkLocalizationEditor) 或 [GitHub Action](https://inlang.com/m/3gk8n4n4/app-inlang-ninjaI18nAction)。

## i18n Ally

[i18n Ally](https://marketplace.visualstudio.com/items?itemName=antfu.i18n-ally) 是 VSCode 的 i18n 扩展。

i18n Ally 为你的 i18n 开发提供了出色的开发体验。

在 [README](https://github.com/antfu/i18n-ally/blob/master/README.md) 中阅读有关 i18n Ally 的更多信息。

## i18nPlugin (intellij 平台)

[i18nPlugin](https://github.com/nyavro/i18nPlugin) Intellij idea i18next 支持插件 ([JetBrains 插件页面](https://plugins.jetbrains.com/plugin/12981-i18n-support))。

适用于 i18n typescript/javascript/PHP 的插件。支持 vue-i18n。要启用 vue-i18n 支持，请转到设置 -> 工具 -> i18n 插件配置，然后选中 "Vue-i18n"。你需要设置 vue 本地化目录（默认为 locales）。

## Easy I18n (intellij 平台)

基于 IntelliJ IDEA 的 IDE 的翻译助手。需要专用的语言文件。功能：`树状/表格视图` / `搜索过滤` / `缺少翻译的指示` / `快速 CRUD 操作`。

[JetBrains 市场](https://plugins.jetbrains.com/plugin/16316-easy-i18n) // [GitHub 仓库](https://github.com/marhali/easy-i18n)

## BabelEdit

[BabelEdit](https://www.codeandweb.com/babeledit) 是用于 Web 应用程序的翻译编辑器。

BabelEdit 可以翻译 `json` 文件，也可以翻译单文件组件的 `i18n` 自定义块。

在[教程页面](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-vue-app-with-vue-i18n)中阅读有关 BabelEdit 的更多信息。

## vue-i18n-extract

[vue-i18n-extract](https://github.com/pixari/vue-i18n-extract) 对基于 vue-i18n 的 Vue.js 项目执行静态分析，并报告以下信息：

- 所有**未使用的 vue-i18n 键**列表（在语言文件中找到但在项目中未使用的条目）
- 所有**缺失键**列表（在项目中找到但在语言文件中未找到的条目）

可以在控制台中显示输出或将其写入 json 文件。

缺失的键也可以自动添加到给定的语言文件中。

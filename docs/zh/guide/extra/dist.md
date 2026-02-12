# 不同的发行版文件

在 [npm 包的 dist/ 目录](https://cdn.jsdelivr.net/npm/vue-i18n@9.1.10/dist/) 中，你会发现 Vue I18n 的许多不同构建版本。这里概述了根据用例应使用哪个 dist 文件。

## 从 CDN 或无打包器

- **`vue-i18n(.runtime).global(.prod).js`**:
  - 用于通过 `<script src="...">` 在浏览器中直接使用。公开 `VueI18n` 全局变量
  - 浏览器内消息格式编译：
    - `vue-i18n.global.js` 是“完整”构建，包含编译器和运行时，因此支持动态编译消息格式
    - `vue-i18n.runtime.global.js` 仅包含运行时，并且需要在构建步骤期间预编译消息格式
  - 内联所有 Vue I18n 核心内部包 - 即，它是单个文件，不依赖于其他文件。这意味着你 **必须** 从此文件导入所有内容，并且仅从此文件导入，以确保获得相同的代码实例
  - 包含硬编码的 prod/dev 分支，并且 prod 构建已预压缩。在生产环境中使用 `*.prod.js` 文件

:::tip 注意
全局构建不是 [UMD](https://github.com/umdjs/umd) 构建。它们构建为 [IIFE](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)，仅用于通过 `<script src="...">` 直接使用。
:::

- **`vue-i18n(.runtime).esm-browser(.prod).js`**:
  - 用于通过原生 ES 模块导入使用（在浏览器中通过 `<script type="module">`）
  - 与全局构建共享相同的运行时编译、依赖项内联和硬编码的 prod/dev 行为

## 使用打包器

- **`vue-i18n(.runtime).esm-bundler.js`**:
  - 用于与 `webpack`、`rollup` 和 `parcel` 等打包器一起使用
  - 保留带有 `process.env`<wbr/>`.NODE_ENV` 守卫的 prod/dev 分支（必须由打包器替换）
  - 不提供压缩构建（在打包后与其余代码一起完成）
  - 导入依赖项（例如 `@intlify/core-base`, `@intlify/message-compiler`）
    - 导入的依赖项也是 `esm-bundler` 构建，并将依次导入其依赖项（例如 `@intlify/message-compiler` 导入 `@intlify/shared`）
    - 这意味着你 **可以** 单独安装/导入这些依赖项，而不会最终得到这些依赖项的不同实例，但你必须确保它们都解析为相同的版本
  - 浏览器内语言环境消息编译：
    - **`vue-i18n.runtime.esm-bundler.js`** 仅运行时，并且需要预编译所有语言环境消息。这是打包器的默认入口（通过 `package.json` 中的 `module` 字段），因为在使用打包器时，模板通常是预编译的（例如在 `*.json` 文件中）
    - **`vue-i18n.esm-bundler.js` (默认)**: 包含运行时编译器。如果你正在使用打包器但仍想要语言环境消息编译（例如通过内联 JavaScript 字符串的模板），请使用此选项。要使用此构建，请将你的导入语句更改为：`import { createI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";`

:::tip 注意
如果你使用 `vue-i18n.runtime.esm-bundler.js`，你需要预编译所有语言环境消息，你可以使用 `.json` (`.json5`) 或 `.yaml`、i18n 自定义块来管理 i18n 资源。因此，你将使用打包器和以下加载器/插件预编译所有语言环境消息。

- [`@intlify/unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)
:::

## 用于 Node.js (服务器端)

- **`vue-i18n(.runtime).node.js`**:
  - 用于 Node.js 中的 ES 模块使用
  - 通过 `import` 在 Node.js 中使用
  - dev/prod 文件已预构建，但会根据 `process.env`<wbr/>`.NODE_ENV` 自动需要适当的文件
  - 此模块是 `vue-i18n(.runtime).js` 的代理模块
    - **`vue-i18n.runtime.node.js`**: 仅运行时。
    - **`vue-i18n.node.js`**: 包含运行时编译器。

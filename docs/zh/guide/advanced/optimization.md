# 优化

## 性能

如“[不同的发行版文件](../extra/dist#from-cdn-or-without-a-bundler)”部分所述，Vue I18n 为打包器提供以下两个构建的 ES 模块。

- 消息编译器 + 运行时：**`vue-i18n.esm-bundler.js`**
- 仅运行时：**`vue-i18n.runtime.esm-bundler.js`**

对于打包器，默认配置为将 `vue-i18n.esm-bundler.js` 与 [`@intlify/unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) 打包在一起。如果你想进一步减小包大小，可以将打包器配置为使用 `vue-i18n.runtime.esm-bundler.js`，它是仅运行时的。

使用 ES 模块 `vue-i18n.runtime.esm-bundler.js` 意味着 **所有语言环境消息都必须预编译为消息函数或 AST 资源**。这意味着，它提高了性能，因为 vue-i18n 仅执行消息函数，因此无需编译。

:::tip 注意
在 v9.3 之前，语言环境消息将被编译为消息函数，在 v9.3 或更高版本之后，这些将使用 `@intlify/bundle-tools` 编译为 AST。
:::

:::tip 注意
在 v9.3 之前，所有语言环境消息都使用 `@intlify/unplugin-vue-i18n` 编译，因此消息编译器未打包，**包大小可以减小**。

在 v9.3 之后，由于消息编译器也已打包，因此无法减小包大小。**这是一种权衡**。
关于原因，请参阅 [JIT 编译详情](#jit-编译)。
:::

:::danger 注意
如果在 v9.3 之前启用了 [CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)，`vue-i18n.esm-bundler.js` 将无法与编译器一起工作，因为使用了 `eval` 语句。这些语句违反了 `default-src 'self'` 标头。相反，你需要使用 `vue-i18n.runtime.esm-bundler.js`。
:::

:::warning 注意
从 v9.3 开始，可以通过 vue-i18n 消息编译器的 JIT 编译来解决 CSP 问题。请参阅 [JIT 编译详情](#jit-编译)。
:::

## 如何配置

我们可以使用某些打包器的模块解析别名功能（例如 `resolve.alias` vite 和 webpack）配置这些模块路径，但这需要时间和精力。
为了简单起见，Intlify 项目为某些打包器提供了插件/加载器

### unplugin-vue-i18n

[`unplugin`](https://github.com/unjs/unplugin) 是一个用于打包工具（如 vite、webpack、rollup、esbuild 等）的统一插件系统。

Intlify 项目正在为 vite 和 webpack 提供 [`unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)。

如果你进行生产构建，Vue I18n 将自动打包仅运行时模块

#### 安装插件

::: code-group

```sh [npm]
npm install @intlify/unplugin-vue-i18n -D
```

```sh [yarn]
yarn add @intlify/unplugin-vue-i18n -D
```

```sh [pnpm]
pnpm add -D @intlify/unplugin-vue-i18n
```

:::


#### 为 vite 配置插件

<!-- eslint-skip -->

```js
// vite.config.ts
import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  /* ... */
  plugins: [
    /* ... */
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
    }),
  ],
})
```

#### 为 webpack 配置插件

<!-- eslint-skip -->

```js
// webpack.config.js
const path = require('path')
const VueI18nPlugin = require('@intlify/unplugin-vue-i18n/webpack')

module.exports = {
  /* ... */
  plugins: [
    /* ... */
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: path.resolve(__dirname, './path/to/src/locales/**'),
    })
  ]
}
```

#### 更多配置

关于选项和功能，请参阅详细 [页面](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#intlifyunplugin-vue-i18n)


### Quasar CLI

无需做任何事情。[Quasar CLI](https://quasar.dev) 会为你处理优化。


## 功能构建标志

### 使用 tree-shaking 减小包大小

`esm-bundler` 构建现在公开了可以在编译时覆盖的全局功能标志：

- `__VUE_I18N_FULL_INSTALL__`（启用/禁用，除了 vue-i18n API 之外，组件和指令全部完全支持安装：`true`）
- `__VUE_I18N_LEGACY_API__`（启用/禁用 vue-i18n 传统风格 API 支持。传统 API 已在 v12 中移除，默认：`false`）

构建将在不配置这些标志的情况下工作，但是 **强烈建议** 正确配置它们，以便在最终包中获得适当的 tree shaking。

关于如何为打包器配置，请参阅 [这里](#为打包器配置功能标志)。

### JIT 编译

:::tip 支持版本
:new: 9.3+
:::

在 v9.3 之前，vue-i18n 消息编译器像 AOT（提前）一样预编译语言环境消息。

但是，它有以下问题：

- CSP 问题：很难在 service/web workers、CDN 的边缘运行时等上工作。
- 后端集成：很难通过 API 从数据库等后端获取消息并动态本地化它们

为了解决这些问题，JIT（即时）风格编译被支持为消息编译器。

每次在应用程序中使用 `$t` 或 `t` 函数执行本地化时，消息资源将在消息编译器上编译。

你需要使用 `esm-bundler` 构建和 vite 等打包器配置以下功能标志：

- `__INTLIFY_JIT_COMPILATION__`（启用/禁用 JIT 风格的消息编译器，默认：`false`）
- `__INTLIFY_DROP_MESSAGE_COMPILER__`（启用/禁用我们在打包时是否对消息编译器进行 tree-shake，当启用 `__INTLIFY_JIT_COMPILATION__` 时此标志起作用。默认：`false`）

:::warning 注意
此功能默认为选择退出，因为与 v9.3 之前的版本兼容。
:::

:::warning 注意
从 v10 开始，默认启用 JIT 编译，因此不再需要在打包器中设置 `__INTLIFY_JIT_COMPILATION__` 标志。
:::

关于如何为打包器配置，请参阅 [这里](#为打包器配置功能标志)。


### 为打包器配置功能标志

- webpack: 使用 [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)
- Rollup: 使用 [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace)
- Vite: 默认配置，但可以使用 [`define` 选项](https://github.com/vitejs/vite/blob/a4133c073e640b17276b2de6e91a6857bdf382e1/src/node/config.ts#L72-L76) 覆盖
- Quasar CLI: 默认配置，但可以使用 quasar.conf.js > build > rawDefine 覆盖

:::tip 注意
替换值 **必须是布尔字面量**，不能是字符串，否则打包器/压缩器将无法正确评估条件。
:::


## 使用扩展进行预翻译

你可以使用 vue-i18n-extensions 包进行预翻译（服务器端渲染）。

关于如何使用，请参阅 [这里](https://github.com/intlify/vue-i18n-extensions)。

## SSR (服务器端渲染)

### 为 SSR 配置插件

对于 SSR 应用程序，你需要在 [@intlify/unplugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#ssr) 中配置 `ssr` 选项：

<!-- eslint-skip -->

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  plugins: [
    VueI18nPlugin({
      ssr: true, // 启用 SSR 支持
    }),
  ],
})
```

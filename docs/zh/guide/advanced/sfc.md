# 单文件组件

## 基本用法

如果你正在使用单文件组件构建 Vue 组件或 Vue 应用程序，你可以使用 i18n 自定义块管理语言环境消息。

以下是 [单文件组件示例](https://github.com/kazupon/vue-i18n/tree/dev/examples/sfc)：

```vue
<script>
export default {
  name: 'App'
}
</script>

<template>
  <label for="locale">locale</label>
  <select v-model="$i18n.locale">
    <option>en</option>
    <option>ja</option>
  </select>
  <p>message: {{ $t('hello') }}</p>
</template>

<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界！"
  }
}
</i18n>
```

在 i18n 自定义块中，语言环境消息资源的格式默认为 **json** 格式。

i18n 自定义块定义的语言环境消息在单文件组件中用作本地作用域。

如果在模板中使用了 `$t('hello')`，则会引用 `i18n` 自定义块定义的 `hello` 键。

:::tip 注意
组合式 API 需要 `useI18n` 返回 `setup` 上下文，以便参考 i18n 自定义块中定义的语言环境消息进行本地化。

关于如何使用 `useI18n`，请参阅 [组合式 API](./composition)
:::

要使用 i18n 自定义块，你需要为打包器使用以下插件。


## 使用 Vite 打包

### unplugin-vue-i18n

[`unplugin`](https://github.com/unjs/unplugin) 是一个用于打包工具（如 vite、webpack、rollup、esbuild 等）的统一插件系统。

[`unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) 适用于 vite 和 webpack。

:::tip 要求
- vite：**v3 或更高版本**
- @vitejs/plugin-vue：**v3.2.0 或更高版本**。
:::

#### 安装

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

#### 为 Vite 配置插件

<!-- eslint-skip -->

```js
// vite.config.ts
import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
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

#### 为 Webpack 配置插件

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

## Quasar CLI

如果我们想在 [Quasar CLI](https://quasar.dev) 项目的单文件组件中添加对 `<i18n>` 标签的支持，那么我们需要修改现有配置。

为此，我们需要编辑项目根目录下的 `quasar.conf.js`：

```js
{
  chain => {
    chain.module
      .rule('i18n-resource')
        .test(/\.(json5?|ya?ml)$/)
          .include.add(path.resolve(__dirname, './src/i18n'))
          .end()
        .type('javascript/auto')
        .use('i18n-resource')
          .loader('@intlify/vue-i18n-loader')
    chain.module
      .rule('i18n')
        .resourceQuery(/blockType=i18n/)
        .type('javascript/auto')
        .use('i18n')
          .loader('@intlify/vue-i18n-loader')
  }
}
```

我们还需要确保已经安装了 `@intlify/vue-i18n-loader`：

::: code-group

```sh [npm]
npm install @intlify/vue-i18n-loader -D
```

```sh [yarn]
yarn add @intlify/vue-i18n-loader -D
```

```sh [pnpm]
pnpm add -D @intlify/vue-i18n-loader
```

:::

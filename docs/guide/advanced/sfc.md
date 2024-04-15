# Single file components

## Basic Usage

If you are building Vue component or Vue application using single file components, you can manage the locale messages with using i18n custom block.

The following in [single file components example](https://github.com/kazupon/vue-i18n/tree/dev/examples/sfc):

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

In i18n custom blocks, the format of the locale messages resource is **json** format by default.

The locale messages defined by i18n custom blocks, are used as the  local scope in single file components.

If `$t('hello')` is used in the template, the `hello` key defined by `i18n` custom blocks is referred to.

:::tip NOTE
The Composition API requires `useI18n` to return the `setup` context in order to localize with reference to locale messages defined in the i18n custom blocks.

About how to usage of `useI18n` , see the [Composition API](./composition)
:::

To use i18n custom blocks, you need to use the following plugins for bundler.


## Bundling with Vite

### unplugin-vue-i18n

[`unplugin`](https://github.com/unjs/unplugin) is an unified plugin system for bundle tool such as vite, webpack, rollup, esbuild and etc.

[`unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) for vite and webpack.

:::tip REQUIREMENTS
- vite: **v3 or later**
- @vitejs/plugin-vue: **v3.2.0 or later**.
:::

#### Installation

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

#### Configure plugin for Vite

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

#### Configure plugin for Webpack

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

If we want to add support to the `<i18n>` tag inside a single file component in a [Quasar CLI](https://quasar.dev) project then we need to modify the existing configuration.

In order to do that we need to edit `quasar.conf.js` at the root of our project:

```js
build: {
  chainWebpack: chain => {
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

We also need to make sure that we've installed `@intlify/vue-i18n-loader`:

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

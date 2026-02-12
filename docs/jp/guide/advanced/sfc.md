# 単一ファイルコンポーネント

## 基本的な使用法

単一ファイルコンポーネントを使用して Vue コンポーネントまたは Vue アプリケーションを構築している場合、i18n カスタムブロックを使用してロケールメッセージを管理できます。

以下は [単一ファイルコンポーネントの例](https://github.com/kazupon/vue-i18n/tree/dev/examples/sfc) です：

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

i18n カスタムブロックでは、ロケールメッセージリソースの形式はデフォルトで **json** 形式です。

i18n カスタムブロックで定義されたロケールメッセージは、単一ファイルコンポーネントのローカルスコープとして使用されます。

テンプレートで `$t('hello')` が使用されている場合、`i18n` カスタムブロックで定義された `hello` キーが参照されます。

:::tip NOTE
Composition API では、i18n カスタムブロックで定義されたロケールメッセージを参照してローカライズするために、`useI18n` が `setup` コンテキストを返す必要があります。

`useI18n` の使用方法については、[Composition API](./composition) を参照してください。
:::

i18n カスタムブロックを使用するには、バンドラに以下のプラグインを使用する必要があります。


## Vite でのバンドル

### unplugin-vue-i18n

[`unplugin`](https://github.com/unjs/unplugin) は、vite、webpack、rollup、esbuild などのバンドルツールのための統一プラグインシステムです。

[`unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) は vite と webpack 用です。

:::tip REQUIREMENTS
- vite: **v3 以降**
- @vitejs/plugin-vue: **v3.2.0 以降**。
:::

#### インストール

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

#### Vite 用プラグインの設定

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

#### Webpack 用プラグインの設定

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

[Quasar CLI](https://quasar.dev) プロジェクトの単一ファイルコンポーネント内で `<i18n>` タグのサポートを追加したい場合は、既存の設定を変更する必要があります。

そのために、プロジェクトのルートにある `quasar.conf.js` を編集する必要があります：

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

また、`@intlify/vue-i18n-loader` がインストールされていることを確認する必要があります：

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

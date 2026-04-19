# インストール

## 互換性に関する注意

- Vue.js `3.0.0` 以上

## パッケージマネージャ

::: code-group

```sh [npm]
npm install vue-i18n@11
```

```sh [yarn]
yarn add vue-i18n@11
```

```sh [pnpm]
pnpm add vue-i18n@11
```

:::

モジュールシステムで使用する場合は、`app.use()` を介して `vue-i18n` を明示的にインストールする必要があります：

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // vue-i18n のオプションをここに記述 ...
})

const app = createApp({
  // vue のオプションをここに記述 ...
})

app.use(i18n)
app.mount('#app')
```

## 直接ダウンロード

<https://unpkg.com/vue-i18n@11>

[unpkg.com](https://unpkg.com) は、npm ベースの CDN リンクを提供します。上記のリンクは常に npm 上の最新リリースを指します。

### グローバルインポート

```html
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-i18n@11"></script>
```

<https://unpkg.com/vue-i18n@11.0.0/dist/vue-i18n.global.js> のような URL を介して特定のバージョン/タグを使用することもできます。

### ES モジュールインポート

```html
<script type="module" src="https://unpkg.com/vue@3/dist/vue.esm-browser.js">
<script type="module" src="https://unpkg.com/vue-i18n@11/dist/vue-i18n.esm-browser.js">
```

<https://unpkg.com/vue-i18n@11.0.0/dist/vue-i18n.esm-browser.js> のような URL を介して特定のバージョン/タグを使用することもできます。

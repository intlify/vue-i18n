# Vue I18n の小型サイズサブセット

`petite-vue-i18n` は、最小限の機能のみを提供する Vue I18n の代替ディストリビューションです。

## Vue I18n との違いは何ですか？

- サイズが vue-i18n より小さい
  - CDN またはバンドラなし
    - パッケージ削減サイズ: ランタイム + コンパイラ `~32%`、ランタイムのみ `~45%`
    - `petite-vue-i18n`: ランタイム + コンパイラ `~9.61KB`、ランタイムのみ `~5.51KB`（プロダクションビルド、brotli 圧縮）
    - `vue-i18n`: ランタイム + コンパイラ `~14.18KB`、ランタイムのみ `~10.12KB`（プロダクションビルド、brotli 圧縮）
  - ブラウザ用 ES モジュール
    - パッケージ削減サイズ: ランタイム + コンパイラ `~32%`、ランタイムのみ `~45%`
    - `petite-vue-i18n`: ランタイム + コンパイラ `~10.51KB`、ランタイムのみ `~6.20KB`（プロダクションビルド、brotli 圧縮）
    - `vue-i18n`: ランタイム + コンパイラ `~15.40KB`、ランタイムのみ `~11.12KB`（プロダクションビルド、brotli 圧縮）
  - アプリケーションバンドルサイズ
    - `vue-i18n` からの削減サイズ: `~10%`（[vue-i18n](https://github.com/intlify/vue-i18n/tree/master/packages/size-check-vue-i18n) および [petite-vue-i18n](https://github.com/intlify/vue-i18n/tree/master/packages/size-check-petite-vue-i18n) のコードサイズチェック測定）
- レガシー API はサポートされておらず、**Composition API のみ**
- 以下の日時フォーマット、数値フォーマット、およびユーティリティの API は含まれていません。**翻訳のみ**
  - `n`, `$n`
  - `d`, `$d`
  - `rt`, `$rt`
  - `tm`, `$tm`
  - `getDateTimeFormat`, `setDateTimeFormat`, `mergeDateTimeFormat`
  - `getNumberFormat`, `setNumberFormat`, `mergeNumberFormat`
- **処理できるロケールメッセージは単純なキーと値のみです**。階層的なロケールメッセージを処理できる場合は、API を使用してカスタマイズする必要があります
- ローカルフォールバックのアルゴリズムは、`fallbackLocale` で指定された **配列順序** です
- カスタムディレクティブ `v-t` は含まれていません
- `vue-i18n` が提供する以下のコンポーネントは含まれていません
  - Translation `i18n-t`
  - DatetimeFormat `i18n-d`
  - NumberFormat `i18n-n`

## `petite-vue-i18n` のユースケース

`vue-i18n` には、翻訳、日時フォーマット、数値フォーマットなど、さまざまな i18n 機能が含まれています。プロジェクトによっては、翻訳のみを使用し、日時フォーマットを使用しない場合があります。現時点では、その場合でも、その機能のコードが含まれています。

プロジェクトが翻訳に `t` または `$t` API のみを使用する場合、`vue-i18n` よりも `petite-vue-i18n` を使用することをお勧めします。プロジェクトで `vue-i18n` の機能が必要な場合は、`petite-vue-i18n` から `vue-i18n` にスムーズに移行できます。これは、プログレッシブエンハンスメントであることを意味します。

## インストール

基本的には `vue-i18n` のインストールと同じです。唯一の違いは、URL の一部またはパスの一部が `vue-i18n` から `petite-vue-i18n` に変更されていることです。

### CDN
`<head>` の最後に以下のスクリプトを挿入する必要があります：

```html
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/petite-vue-i18n"></script>
```

以下はスクリプトタグを使用したアプリケーションコードです：

```html
<script>
const { createApp } = Vue
const { createI18n } = PetiteVueI18n

const i18n = createI18n({
  // vue-i18n のオプションをここに記述 ...
})

const app = createApp({
  // vue のオプションをここに記述 ...
})

app.use(i18n)
app.mount('#app')
</script>
```

### パッケージマネージャ

::: code-group

```sh [npm]
npm install petite-vue-i18n@next --save
```

```sh [yarn]
yarn add petite-vue-i18n@next
```

```sh [pnpm]
pnpm add petite-vue-i18n@next
```
:::


```js
import { createApp } from 'vue'
import { createI18n } from 'petite-vue-i18n'

const i18n = createI18n({
  // vue-i18n のオプションをここに記述 ...
})

const app = createApp({
  // vue のオプションをここに記述 ...
})

app.use(i18n)
app.mount('#app')
```

## 使用法

### Hello world

テンプレート：
```html
<div id="app">
  <h1>{{ t('hello world') }}</h1>
</div>
```

スクリプト：
```js
const { createApp } = Vue
const { createI18n, useI18n } = PetiteVueI18n
// または ES モジュールの場合
// import { createApp } from 'vue'
// import { createI18n } from 'petite-vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      'hello world': 'Hello world!'
    },
    ja: {
      'hello world': 'こんにちは、世界！'
    }
  }
})

// App コンポーネントを定義
const App = {
  setup() {
    const { t } = useI18n()
    return { t }
  }
}

const app = createApp(App)

app.use(i18n)
app.mount('#app')
```

### `vue-i18n` と同じメッセージリゾルバとロケールフォールバッカーを使用する

`petite-vue-i18n` では、[違いのセクション](https://github.com/intlify/vue-i18n/tree/master/packages/petite-vue-i18n#question-what-is-the-difference-from-vue-i18n-) で説明されているように、メッセージリゾルバとロケールフォールバッカーは、コードサイズを最適化するために単純な実装を使用しています：

- メッセージリゾルバ
  - キーバリュースタイルのロケールメッセージを解決します
  - 実装については、[こちら](https://github.com/intlify/vue-i18n/blob/2d4d2a342f8bae134665a0b7cd945fb8b638839a/packages/core-base/src/resolver.ts#L305-L307) を参照してください
- ロケールフォールバッカー
  - `fallbackLocale` で指定された配列順序に従ってフォールバックします
  - 単純な文字列ロケールが指定された場合、そのロケールにフォールバックします
  - 実装については、[こちら](https://github.com/intlify/vue-i18n/blob/2d4d2a342f8bae134665a0b7cd945fb8b638839a/packages/core-base/src/fallbacker.ts#L40-L58) を参照してください

`vue-i18n` と同じメッセージリゾルバとロケールフォールバッカーを使用したい場合は、API を使用して変更できます。

現時点では、vite や webpack などのバンドラのみがサポートされていることに注意してください。

パッケージマネージャを使用して、`@intlify/core-base` をプロジェクトにインストールする必要があります。

::: code-group

```sh [npm]
npm install --save @intlify/core-base@next
```

```sh [yarn]
yarn add @intlify/core-base@next
```

```sh [pnpm]
pnpm add @intlify/core-base@next
```
:::

次に、アプリケーションのエントリポイントで、以下のように API を使用してメッセージリゾルバとロケールフォールバッカーを設定します：

<!-- eslint-skip -->

```js
import { createApp } from 'vue'
import {
  createI18n,
  registerMessageResolver, // メッセージリゾルバ API を登録
  registerLocaleFallbacker, // ロケールフォールバッカー API を登録
} from 'petite-vue-i18n'
import {
  resolveValue, // デフォルトで使用される vue-i18n のメッセージリゾルバ
  fallbackWithLocaleChain // デフォルトで使用される vue-i18n のロケールフォールバッカー
} from '@intlify/core-base'

// vue-i18n のメッセージリゾルバを登録
registerMessageResolver(resolveValue)

// vue-i18n のロケールフォールバッカーを登録
registerLocaleFallbacker(fallbackWithLocaleChain)

// 何らかのコード ...
// ...
```

上記の設定により、ロケールメッセージの解決とロケールフォールバックは vue-i18n と同様に処理されますが、コードサイズがわずかに増加することに注意してください。

### バンドラプラグインの設定

vite などのビルドツールチェーンでアプリケーションを構築している場合は、設定を行う必要があります。
[`@intlify/unplugin-vue-i18n` の 'module' オプション](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#module) 設定を以下のように設定してください。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!NOTE]
> `@intlify/unplugin-vue-i18n` の設定については、['パフォーマンス' セクション](./optimization.md) および [`@intlify/unplugin-vue-i18n` ドキュメント](https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md) を参照してください。

> [!IMPORTANT]
> `@intlify/unplugin-vue-i18n` バージョンは **5.1.0 以降** である必要があります

<!-- eslint-enable markdown/no-missing-label-refs -->

```diff
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
+      module: 'petite-vue-i18n',
       // locale messages resource pre-compile option
       include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
     }),
   ],
 })
```

### インポート ID を変更せずに切り替える

インポート ID を変更せずに、npm エイリアスを使用してアプリケーション内で vue-i18n から petite-vue-i18n に切り替えることができます。

package.json:
```diff
 {
   // ...
   "dependencies": {
     "vue": "^3.4.14",
-     "vue-i18n": "^10.0.0"
+     "vue-i18n": "npm:petite-vue-i18n@^10.0.0"
   },
 }
```

アプリケーションを構築するには `@intlify/unplugin-vue-i18n` が必要です。

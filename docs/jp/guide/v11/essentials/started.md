:::warning v11 ドキュメント
これは **Vue I18n v11** のドキュメントです。v12 以降を使用している場合は、[最新のガイド](/jp/guide/essentials/started) を参照してください。
:::

# クイックスタート

Vue + Vue I18n でグローバルアプリケーションを作成するのは非常に簡単です。Vue.js を使えば、すでにコンポーネントでアプリケーションを構成しているはずです。Vue I18n を追加する場合、必要なのはリソースメッセージを準備し、Vue I18n で提供されるローカリゼーション API を使用するだけです。

:::tip NOTE
このガイドでは、すでに Vue 自体に精通していることを前提としています。Vue のエキスパートである必要はありませんが、特定の機能の詳細については、時折 [Vue のコアドキュメント](https://vuejs.org/) を参照する必要があるかもしれません。
:::

## 例

次の例を考えてみましょう：

- [StackBlitz の例](https://stackblitz.com/edit/vue-i18n-get-started-jtknregd?file=main.js)

まずはルートコンポーネントである `App.vue` から見ていきましょう。

### App.vue

```vue
<template>
  <h1>{{ $t('message.hello') }}</h1>
</template>
```

テンプレートでは、Vue I18n によって注入された `$t` 翻訳 API を使用してローカライズを行います。これにより、Vue I18n はテンプレートを書き換えることなくロケールを変更でき、グローバルアプリケーションもサポートできます。

出力は以下のようになります：

```vue
<h1>こんにちは、世界</h1>
```

これが JavaScript でどのように実現されているかを見てみましょう！

### i18n インスタンスの作成

i18n インスタンスは、`createI18n` 関数を呼び出すことで作成されます。

```js
const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'en',
  messages: {
    en: {
      message: {
        hello: 'hello world'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、世界'
      }
    }
  }
})
```

`createI18n` にはいくつかのオプションを指定できます。
重要なオプションは `locale`、`fallbackLocale`、`messages` オプションです。

`locale` は、ローカライズされる Vue アプリケーションの言語です。

`fallbackLocale` は、`$t` 翻訳 API で指定されたキーリソースが `locale` の言語で見つからない場合にフォールバックする言語です。

`messages` は、`$t` 翻訳 API で翻訳するためのロケールメッセージです。ロケールメッセージの構造は、各ロケールを最上位プロパティとする階層的なオブジェクト構造です。

### i18n プラグインの登録

i18n インスタンスを作成したら、アプリケーションで `use` を呼び出してプラグインとして登録する必要があります：

```js
const app = createApp(Vue)
app.use(i18n)
app.mount('#app')
```

ほとんどの Vue プラグインと同様に、`use` の呼び出しは `mount` の呼び出しの前に行う必要があります。

このプラグインが何をしているか興味がある場合、その役割の一部は次のとおりです：

1. `$t`、`$i18n` などのグローバルプロパティとメソッドの追加
2. `useI18n` コンポーザブルの有効化
3. `i18n-t`、`i18n-d`、`i18n-n` コンポーネントの [グローバル登録](https://vuejs.org/guide/components/registration.html#global-registration)。

## このガイドの規約

### シングルファイルコンポーネント

Vue I18n は、バンドラー（例：Vite）と [SFC](https://vuejs.org/guide/introduction.html#single-file-components)（つまり `.vue` ファイル）を使用して構築されたアプリケーションで最も一般的に使用されます。このガイドのほとんどの例はそのスタイルで記述されていますが、Vue I18n 自体はビルドツールや SFC の使用を必要としません。

たとえば、[Vue](https://vuejs.org/guide/quick-start.html#using-vue-from-cdn) と [Vue I18n](/jp/guide/installation#Direct-Download-CDN) の _グローバルビルド_ を使用している場合、ライブラリはインポートではなくグローバルオブジェクトを介して公開されます：

```js
const { createApp } = Vue
const { createI18n, useI18n } = VueI18n
```

### コンポーネント API スタイル

Vue I18n は、Composition API と Options API の両方で使用できます。関連する場合、このガイドの例では両方のスタイルで記述されたコンポーネントを示します。Composition API の例では、明示的な `setup` 関数ではなく、通常 `<script setup>` を使用します。

2 つのスタイルについて復習が必要な場合は、[Vue - API スタイル](https://vuejs.org/guide/introduction.html#api-styles) を参照してください。

Vue I18n は、Vue の Composition API と Options API の両方で動作します。Vue I18n には、Vue と同様に Composition API と Options API 用の Legacy API の 2 つの API スタイルがあります。

:::danger 重要
Vue I18n v9 以降では、Vue I18n v8.x で提供されていた API は **Legacy API** モードと呼ばれます。
Legacy API は Vue I18n v11 で非推奨となり、Vue I18n v12 で廃止されます。Composition API モードの使用を推奨します。
:::

以下のセクションでは、Legacy API を使用して説明します。

Composition API スタイルで使用したい場合やすでに Vue I18n を理解している場合は、[こちら](../advanced/composition) に進んでください。
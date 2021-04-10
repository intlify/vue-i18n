# はじめよう

:::tip 備考
このガイド内のコードサンプルでは[ES6](https://github.com/lukehoban/es6features)を使用します。

また、オンザフライテンプレートコンパイルを可能にするために、全ての例はVueの完全版を使用します。詳しくは[こちら](https://v3.vuejs.org/guide/installation.html#runtime-compiler-vs-runtime-only)を参照してください。
:::

Vue + Vue I18nでグローバルアプリケーションを作るのは非常にシンプルです。すでにVue.jsを使って作られたアプリがあるならば、そのi18nに必要なのは、リソースメッセージの用意とVue I18nが提供するローカライゼーションAPIの使用のみです。

以下は基本的な例です：

## HTML

```html
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/vue-i18n@next"></script>

<div id="app">
  <p>{{ $t("message.hello") }}</p>
</div>
```

HTMLテンプレートで、Vue I18nによって注入された`$t`翻訳APIを使用して、ローカライズしています。これにより、Vue I18nはテンプレートを複数用意することなくロケールを変更することができ、グローバルなアプリケーションに対応できます。

## JavaScript

```js
// 1. 翻訳したロケールメッセージを準備
// ロケールメッセージは、それぞれのロケールをトップのプロパティに持つ階層構造のオブジェクトです
const messages = {
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

// 2. オプションを指定してi18nインスタンスを生成
const i18n = VueI18n.createI18n({
  locale: 'ja', // ロケールをセット
  fallbackLocale: 'en', // フォールバックロケールをセット
  messages, // ロケールメッセージをセット
  // その他オプションを指定できます
  // ...
})


// 3. vueルートインスタンスを生成
const app = Vue.createApp({
  // オプションを設定
  // ...
})

// 4. アプリ全体でi18nを使えるようにi18nインスタンスをインストール
app.use(i18n)

// 5. マウント
app.mount('#app')

// アプリが開始される
```

以下を出力します：

```html
<div id="app">
  <p>こんにちは、世界</p>
</div>
```

`app.use(i18n)`を呼び出すことで、デフォルトで各コンポーネントから、`this.$i18n`でVueI18nインスタンスにアクセスできます。これは`createI18n`で作成したi18nインスタンスの`global`プロパティから参照できます。また、`this.$t`のような翻訳APIも各コンポーネントに注入されるので、これらのAPIをテンプレートで使用することができます。

同様の方法を`setup`関数で使用するには、`useI18n`関数を呼び出す必要があります。これについては、[Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)で詳しく説明されています。

このドキュメントでは、`this.$i18n`や`this.$t`といった API を使用していますが、これらは Vue I18n v8.x からの後方互換性をほぼ維持しています。

:::tip 備考
Vue I18n v9以降では、Vue I18n v8.xで提供されていたAPIを**Legacy API**モードと呼びます。
:::

以降のセクションはLegacy APIモードを使って説明されます。

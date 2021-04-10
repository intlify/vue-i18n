# インストール


## 互換性

- Vue.js `3.0.0`+


## 直接ダウンロード

<https://unpkg.com/vue-i18n@next>

[unpkg.com](https://unpkg.com)はnpmに基づいたCDNリンクを提供します。上記リンクは常にnpmの最新版へのリンクです。

### グローバルインポート

```html
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/vue-i18n@next"></script>
```

<https://unpkg.com/vue-i18n@9.0.0-rc.1/dist/vue-i18n.global.js>のようにURLで特定のバージョン・タグを指定して使うこともできます。

### ES modules インポート

```html
<script type="module" src="https://unpkg.com/vue@next/dist/vue.esm-browser.js">
<script type="module" src="https://unpkg.com/vue-i18n@next/dist/vue-i18n.esm-browser.js">
```

<https://unpkg.com/vue-i18n@9.0.0-rc.1/dist/vue-i18n.esm-browser.js>のようにURLで特定のバージョン・タグを指定して使うこともできます。


## パッケージマネージャー

### NPM

```sh
npm install vue-i18n@next
```

### Yarn

```sh
yarn add vue-i18n@next
```

module方式で使う場合、`app.use()`を使って明示的に`vue-i18n`をインストールする必要があります：

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // vue-i18nのオプションをここに記述
})

const app = createApp({
  // vueのオプションをここに記述
})

app.use(i18n)
app.mount('#app')
```


## 開発ビルド

最新の開発ビルドを使いたい場合、GitHubから直接クローンしてあなた自身で`vue-i18n`をビルドする必要があります。

```sh
git clone git@github.com:intlify/vue-i18n-next.git node_modules/vue-i18n
cd node_modules/vue-i18n
npm install # or `yarn`
npm run build  # or `yarn run build`
```


## 異なるビルドの説明
[dist/ directory of the npm package](https://cdn.jsdelivr.net/npm/vue-i18n@9.0.0-rc.1/dist/)内に、Vue I18nの多くの異なるビルドがあります。目的に応じてどのdistファイルを使うべきかの概要をここに示します。

### CDNから、またはバンドラーなしの場合

- **`vue-i18n(.runtime).global(.prod).js`**:
  - ブラウザで`<script src="...">`で直接使う場合。`VueI18n`がグローバルで使えます。
  - ブラウザでのメッセージフォーマットのコンパイル:
    - `vue-i18n.global.js`は、コンパイラとランタイムの両方を含む「フル」ビルドで、メッセージフォーマットのオンザフライコンパイルをサポートしています。
    - `vue-i18n.runtime.global.js`はランタイムのみを含み、メッセージフォーマットはビルドステップで事前にコンパイルされる必要があります。
  - すべてのVue I18nコア内部パッケージを含みます - つまり、他のファイルに依存しない単一のファイルです。すなわち、同じコードのインスタンスを取得するために、このファイルからすべてをインポートする**必要**があります。
  - ハードコードされたprod/devブランチが含まれており、prodビルドは事前に最小化されています。本番環境では、`*.prod.js`ファイルを使用します。

:::tip 備考
グローバルビルドは[UMD](https://github.com/umdjs/umd)ビルドではありません。これらは[IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)としてビルドされ、`<script src="...">` で直接使用することのみを意図しています。
:::

- **`vue-i18n(.runtime).esm-browser(.prod).js`**:
  - ESモジュールのネイティブインポート（ブラウザで`<script type="module">`）で使用する場合
  - ランタイムコンパイル、依存関係のインライン化、ハードコードされたprod/devの動作は、グローバルビルドと同じです。

### バンドラー付き

- **`vue-i18n(.runtime).esm-bundler.js`**:
  - `webpack`、`rollup`、`parcel`のようなバンドラーと使う場合
  - `process.env.NODE_ENV`ガードを持つprod/devブランチを残す（バンドラーで置き換える必要があります）
  - 最小化されたビルドを出力しない（バンドル後に他のコードと一緒に行う必要があります）
  - 依存関係をインポートする（例：`@intlify/core-base`, `@intlify/message-compiler`)
    - インポートされた依存関係は`esm-bundler`のビルドでもあり、その依存関係もインポートする（例：`@intlify/message-compiler`は`@intlify/shared`をインポートします）
    - つまり、これらの依存関係を個別にインストール/インポートしても、異なるインスタンスになってしまうことは**ありません**が、すべての依存関係が同じバージョンで解決されていることを確認する必要があります。
  - ブラウザ内でのロケールメッセージのコンパイル：
    - **`vue-i18n.runtime.esm-bundler.js`** は、ランタイムオンリーで、すべてのロケールメッセージを事前にコンパイルする必要があります。バンドラーを使用する場合、テンプレートは通常にプリコンパイルされている（例：`*.json`ファイル）ので、これは（`package.json`の`module`フィールドを介す）バンドラーのデフォルトのエントリです。
    - **`vue-i18n.esm-bundler.js` (default)**: ランタイムコンパイラを含みます。バンドラーを使用していても、ロケールメッセージのコンパイルが必要な場合 (例: インラインJavaScript文字列によるテンプレート)はこれを使用します。このビルドを使用するには、import文を次のように変更します： `import { createI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";`

:::tip 備考
`vue-i18n.runtime.esm-bundler.js`を使用する場合、すべてのロケールメッセージを事前にコンパイルする必要があります。これは、i18nリソースを管理するためのi18nカスタムブロックである`.json`（`.json5`）または`.yaml`で行うことができます。したがって、バンドラーと以下のローダー/プラグインを使用して、すべてのロケールメッセージを事前にコンパイルすることになります。

- [`@intlify/vue-i18n-loader`](https://github.com/intlify/vue-i18n-loader)
- [`@intlify/rollup-plugin-vue-i18n`](https://github.com/intlify/rollup-plugin-vue-i18n)
- [`@intlify/vite-plugin-vue-i18n`](https://github.com/intlify/vite-plugin-vue-i18n)
:::

### Node.jsの場合（サーバーサイド）

- **`vue-i18n.cjs(.prod).js`**:
  - Node.jsで`require()`によって使う場合
  - webpackでアプリを`target: 'node'`でバンドルし、`vue-i18n`を適切に外部化した場合、このビルドが読み込まれます。
  - dev/prodファイルは事前にビルドされていますが、`process.env.NODE_ENV`に基づいて、適切なファイルが自動的に要求されます。

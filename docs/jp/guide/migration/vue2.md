# Vue 2 からの移行

## `vue-i18n-bridge`

:::danger 注意
Vue 2 の EOL に伴い、vue-i18n-bridge は v10 では提供されません。v9.13 が最後のバージョンになります。
:::

### `vue-i18n-bridge` とは？

`vue-i18n-bridge` は、vue-i18n@v8.26.1 以降と vue-i18n@v9.x の間のアップグレードをできるだけ簡単にするためのブリッジです。

すでに vue-i18n@v8.26.1 以降で構築した Vue 2 アプリケーションで使用できます。

また、一部の機能は vue-i18n@v9.x からバックポートされています。

- `@vue/composition-api` と `vue-demi` を利用した Vue I18n Composition API
- `@intlify/message-compiler` を利用したメッセージフォーマット構文

### インストール

#### パッケージマネージャー

::: code-group

```sh [npm]
npm install vue-i18n-bridge
```

```sh [yarn]
yarn add vue-i18n-bridge
```

```sh [pnpm]
pnpm add vue-i18n-bridge
```

:::

このライブラリを使用する前に、以下のパッケージをインストールする必要があります。

- vue-i18n: >= v8.26.1 < v9
- vue-demi: >= v0.13.5
- @vue/composition-api: >= v1.2.0 (Vue 2.6 を使用する場合)

#### CDN

**Vue 2.7 の場合**:

`vue`、`vue-demi` の後に `vue-i18n-bridge` を含めると、インストールされます。

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.7"></script>
<script src="https://unpkg.com/vue-i18n@8/dist/vue-i18n.min.js"></script>
<script src="https://unpkg.com/vue-demi@0.13.5/lib/index.iife.js"></script>
<script src="https://unpkg.com/vue-i18n-bridge@9.2.0-beta.38/dist/vue-i18n-bridge.global.prod.js"></script>
```

**Vue 2.6 の場合**:

`vue`、`@vue/composition-api`、`vue-demi` の後に `vue-i18n-bridge` を含めると、インストールされます。

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6"></script>
<script src="https://unpkg.com/vue-i18n@8/dist/vue-i18n.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@vue/composition-api@1.4"></script>
<script src="https://unpkg.com/vue-demi@0.13.5/lib/index.iife.js"></script>
<script src="https://unpkg.com/vue-i18n-bridge@9.2.0-beta.38/dist/vue-i18n-bridge.global.prod.js"></script>
```

### 使用法

#### Composition API

**Vue 2.7 の場合**:

```js
import Vue from 'vue'
import { createApp } from 'vue-demi'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueI18n, { bridge: true }) // vue-i18n をインストールするときに '{ bridge: true }' プラグインオプションを指定する必要があります

// `createI18n` オプションは vue-i18n (vue-i18n@v9.x) API とほぼ同じです
const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `vue-i18n-bridge` が提供する `createI18n` には 2 番目の引数があり、`vue-i18n` が提供する `VueI18n` コンストラクターを渡す**必要があります**

const app = createApp({
 setup() {
   // `useI18n` オプションは vue-i18n (vue-i18n@v9.x) API とほぼ同じです
   const { t, locale } = useI18n()
   // ... 何かする

   return { t, locale }
 }
})

app.use(i18n) // `createI18n` によって作成された `i18n` インスタンスをインストールする必要があります
app.mount('#app')
```

**Vue 2.6 の場合**:

```js
import Vue from 'vue'
import VueCompositionAPI, { createApp } from '@vue/composition-api'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true }) // vue-i18n をインストールするときに '{ bridge: true }' プラグインオプションを指定する必要があります

// `createI18n` オプションは vue-i18n (vue-i18n@v9.x) API とほぼ同じです
const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `vue-i18n-bridge` が提供する `createI18n` には 2 番目の引数があり、`vue-i18n` が提供する `VueI18n` コンストラクターを渡す**必要があります**

const app = createApp({
 setup() {
   // `useI18n` オプションは vue-i18n (vue-i18n@v9.x) API とほぼ同じです
   const { t, locale } = useI18n()
   // ... 何かする

   return { t, locale }
 }
})

app.use(i18n) // `createI18n` によって作成された `i18n` インスタンスをインストールする必要があります
app.mount('#app')
```

#### Legacy API

**Vue 2.7 の場合**:

<!-- eslint-skip -->

```js
import Vue from 'vue'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueI18n, { bridge: true }) // vue-i18n をインストールするときに '{ bridge: true }' プラグインオプションを指定する必要があります

// `createI18n` オプションは vue-i18n (vue-i18n@v9.x) API とほぼ同じです
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `vue-i18n-bridge` が提供する `createI18n` には 2 番目の引数があり、`vue-i18n` が提供する `VueI18n` コンストラクターを渡す**必要があります**

Vue.use(i18n) // `createI18n` によって作成された `i18n` インスタンスをインストールする必要があります

const app = new Vue({ i18n })
app.$mount('#app')
```

**Vue 2.6 の場合**:

<!-- eslint-skip -->

```js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true }) // vue-i18n をインストールするときに '{ bridge: true }' プラグインオプションを指定する必要があります

// `createI18n` オプションは vue-i18n (vue-i18n@v9.x) API とほぼ同じです
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `vue-i18n-bridge` が提供する `createI18n` には 2 番目の引数があり、`vue-i18n` が提供する `VueI18n` コンストラクターを渡す**必要があります**

Vue.use(i18n) // `createI18n` によって作成された `i18n` インスタンスをインストールする必要があります

const app = new Vue({ i18n })
app.$mount('#app')
```

**TypeScript の場合:**

<!-- eslint-skip -->

```ts
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { createI18n, useI18n, castToVueI18n } from 'vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true })

// `i18n` インスタンスをキャストする必要があります
const i18n = castToVueI18n(createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n))

Vue.use(i18n)

const app = new Vue({ i18n })
app.$mount('#app')
```

### ブラウザでの UMD モジュールの使用

#### Vue 2.7 の場合
```js
const { createApp } = VueDemi // `VueDemi` という名前でエクスポートされた UMD
const { createI18n, useI18n } = VueI18nBridge // `VueI18nBridge` という名前でエクスポートされた UMD

Vue.use(VueI18n, { bridge: true })

const i18n = createI18n({
  locale: 'ja',
  messages: {
    // ...
  }
}, VueI18n)

const app = createApp({}, {
  // ...
})
app.use(i18n)
app.mount('#app') // Vue アプリのホストコンテナ要素
```

#### Vue 2.6 の場合
```js
const { createApp } = VueCompositionAPI // `VueCompositionAPI` という名前でエクスポートされた UMD
const { createI18n, useI18n } = VueI18nBridge // `VueI18nBridge` という名前でエクスポートされた UMD

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true })

const i18n = createI18n({
  locale: 'ja',
  messages: {
    // ...
  }
}, VueI18n)

const app = createApp({}, {
  // ...
})
app.use(i18n)
app.mount('#app') // Vue アプリのホストコンテナ要素
```

### 制限事項
- Legacy API モードでは、`vue-i18n` から移植された[新しいメッセージフォーマット構文](https://vue-i18n.intlify.dev/guide/essentials/syntax.html)は使用**できません**
  - Composition API モードでのみ使用可能です
- Legacy API モードでは、`vue-i18n` から移植された以下のバックポートされたコンポーネントは使用**できません**
  - 翻訳コンポーネント: `<i18n-t>`
  - 日時フォーマットコンポーネント: `<i18n-d>`
  - 数値フォーマットコンポーネント: `<i18n-n>`
- Composition API モードでは、以下の `$` がプレフィックスの API は**グローバルスコープ**です
  - `$t`
  - `$d`
  - `$n`

### 異なるビルドの説明
[npm パッケージの dist/ ディレクトリ](https://unpkg.com/browse/vue-i18n-bridge@9.2.0-beta.6/dist/)には、`vue-i18n-bridge` のさまざまなビルドがあります。ユースケースに応じてどの dist ファイルを使用すべきかの概要は次のとおりです。

#### CDN から、またはバンドラーなしで

- **`vue-i18n-bridge(.runtime).global(.prod).js`**:
  - ブラウザで `<script src="...">` を介して直接使用する場合。`VueI18nBridge` グローバルを公開します
  - ブラウザ内メッセージフォーマットコンパイル:
    - `vue-i18n-bridge.global.js` は、コンパイラとランタイムの両方を含む「完全な」ビルドであるため、メッセージフォーマットをオンザフライでコンパイルできます
    - `vue-i18n-bridge.runtime.global.js` はランタイムのみを含み、ビルドステップ中にメッセージフォーマットをプリコンパイルする必要があります
  - すべての Vue I18n コア内部パッケージをインライン化します。つまり、他のファイルに依存しない単一のファイルです。つまり、同じコードのインスタンスを確実に取得するには、このファイルからすべてをインポートし、このファイルからのみインポートする**必要があります**
  - ハードコードされた prod/dev ブランチが含まれており、prod ビルドは事前に最小化されています。本番環境には `*.prod.js` ファイルを使用してください

:::warning 通知
グローバルビルドは [UMD](https://github.com/umdjs/umd) ビルドではありません。[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) として構築されており、`<script src="...">` を介して直接使用することのみを目的としています。
:::

- **`vue-i18n-bridge(.runtime).esm-browser(.prod).js`**:
  - ネイティブ ES モジュールインポートを介して使用する場合（ブラウザでは `<script type="module">` を介して）
  - グローバルビルドと同じランタイムコンパイル、依存関係のインライン化、およびハードコードされた prod/dev 動作を共有します

#### バンドラーを使用する場合

- **`vue-i18n-bridge(.runtime).esm-bundler.js`**:
  - `webpack`、`rollup`、`parcel` などのバンドラーで使用する場合
  - `process.env`<wbr/>`.NODE_ENV` ガードを使用して prod/dev ブランチを残します（バンドラーによって置き換える必要があります）
  - 最小化されたビルドは出荷しません（バンドル後に残りのコードと一緒に実行されます）
  - 依存関係をインポートします（例：`@intlify/core-base`、`@intlify/message-compiler`）
    - インポートされた依存関係も `esm-bundler` ビルドであり、順番にそれらの依存関係をインポートします（例：`@intlify/message-compiler` は `@intlify/shared` をインポートします）
    - これは、これらの依存関係の異なるインスタンスになることなく、これらの依存関係を個別にインストール/インポート**できる**ことを意味しますが、それらすべてが同じバージョンに解決されるようにする必要があります
  - ブラウザ内ロケールメッセージコンパイル:
    - **`vue-i18n-bridge.runtime.esm-bundler.js`** はランタイムのみであり、すべてのロケールメッセージをプリコンパイルする必要があります。これは、バンドラーを使用する場合、テンプレートは通常プリコンパイルされるため（例：`*.json` ファイル内）、バンドラーのデフォルトエントリです（`package.json` の `module` フィールドを介して）
    - **`vue-i18n-bridge.esm-bundler.js` (デフォルト)**: ランタイムコンパイラが含まれています。バンドラーを使用しているが、それでもロケールメッセージコンパイルが必要な場合（例：インライン JavaScript 文字列を介したテンプレート）はこれを使用してください。このビルドを使用するには、インポートステートメントを次のように変更します: `import { createI18n } from "vue-i18n-bridge/dist/vue-i18n-bridge.esm-bundler.js";`

:::warning 通知
`vue-i18n-bridge.runtime.esm-bundler.js` を使用する場合は、すべてのロケールメッセージをプリコンパイルする必要があります。`.json` (`.json5`) または `.yaml`、i18n カスタムブロックを使用して i18n リソースを管理できます。したがって、バンドラーと以下のローダー/プラグインを使用して、すべてのロケールメッセージをプリコンパイルする予定です。

- [`@intlify/unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)
:::

#### Node.js (サーバーサイド) の場合

- **`vue-i18n-bridge.cjs(.prod).js`**:
  - `require()` を介して Node.js で使用する場合
  - `target: 'node'` で webpack を使用してアプリをバンドルし、`vue-i18n-bridge` を適切に外部化する場合、これはロードされるビルドです
  - dev/prod ファイルは事前に構築されていますが、適切なファイルは `process.env`<wbr/>`.NODE_ENV` に基づいて自動的に要求されます

## `vue-i18n-composable`

Composition API は Vue 3 からサポートされており、公式の [`@vue/composition-api`](https://github.com/vuejs/composition-api) プラグインを使用して、Vue 2 で Composition API を利用できるようにすることができます。

Vue I18n Composition API は、`vue-i18n-composable` プラグインを使用して Vue 2 でも利用できます。

使用方法については、[こちら](https://github.com/intlify/vue-i18n-composable)を参照してください。

:::warning 通知
`vue-i18n-composable` を使用すると、Vue I18n v8.x のメイン API を Composition API と連携させることができます。Vue I18n v9 で提供されるすべての Composition API が利用できるわけではありません。
:::

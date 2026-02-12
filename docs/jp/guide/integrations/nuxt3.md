# Nuxt 3 統合

Nuxt 3 で Vue I18n を使用する場合は、ローカライズされたルーティング、SEO タグなどの高度な機能を備えた [Nuxt I18n (@nuxtjs/i18n)](https://i18n.nuxtjs.org/) を使用することをお勧めします。

## 独自の Nuxt 3 統合を作成する

以下は、Nuxt プラグインを介して Vue I18n を追加することにより、独自の統合で Nuxt 3 アプリケーションを設定するチュートリアルです。

:::warning NOTICE
この統合チュートリアルは、高度な i18n 機能（ルーティングや SEO タグなど）をサポートしておらず、デモンストレーションのみを目的としています。詳細については、Nuxt I18n モジュールを使用して、[i18n.nuxtjs.org](https://i18n.nuxtjs.org/) のドキュメントを確認することを検討してください。
:::

## 要件

このチュートリアルの Node.js 要件は、Nuxt 3 と同じ環境です。

Nuxt 3 の Node.js バージョンについては、[こちら](https://nuxt.com/docs/getting-started/installation#prerequisites) を確認してください。

## サンプルコード

以下のチュートリアルのコードは [examples/frameworks/nuxt3](https://github.com/intlify/vue-i18n/tree/master/examples/frameworks/nuxt3) で入手できます。

また、このチュートリアルに従って作成された、DeepL からの翻訳を提供するカスタム GitHub アクションを備えたデプロイ済みアプリを [nuxt3-app-vue-i18n](https://github.com/lyqht/nuxt3-app-vue-i18n) プロジェクトで見ることができます。

## Nuxt 3 アプリケーションでの vue-i18n の設定

Nuxt 3 で Vue I18n を使用するための初期環境を設定します。

### Nuxt 3 アプリケーションの作成

以下のコマンドを実行して、Nuxt 3 アプリケーションを作成します：

::: code-group

```sh [npx]
npx nuxi init nuxt3-app-vue-i18n
```

```sh [pnpm]
pnpm dlx nuxi init nuxt3-app-vue-i18n
```

:::


上記のコマンドを実行すると、作成された Nuxt 3 初期プロジェクトは以下のディレクトリ構造になります：

```txt
cd nuxt3-app-vue-i18n
tree -L 1
.
├── README.md
├── app.vue
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

### Vue I18n のインストール

以下のコマンドで Vue I18n をインストールします：

::: code-group

```sh [npm]
npm install vue-i18n -D
```

```sh [yarn]
yarn add vue-i18n -D
```

```sh [pnpm]
pnpm add -D vue-i18n
```

:::

### Nuxt プラグインの設定

以下のように `plugins` ディレクトリを作成します：

```sh
mkdir plugins
```

次に、Vue I18n を設定するための Nuxt プラグインファイルを作成します。

```sh
touch plugins/i18n.ts
```

作成したら、プラグインを以下のように定義します：

```ts
import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      en: {
        hello: 'Hello, {name}!'
      }
    }
  })

  vueApp.use(i18n)
})
```

Nuxt 3 アプリケーションをローカライズするためのロケールリソースの設定については、[次のセクション](#nuxt-3-アプリケーションのローカライズ) で説明します

### Nuxt 3 アプリケーションの実行

Vue I18n が Nuxt 3 で動作するかどうかを確認しましょう。

設定した Nuxt 3 アプリケーションの `app.vue` を以下のように編集します：

```vue
<template>
  <div>
    <NuxtWelcome /> // [!code --]
    <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1> // [!code ++]
  </div>
</template>
```

編集して保存したら、以下のコマンドを実行して Nuxt 3 アプリケーションをローカルで実行します：

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

:::


アプリケーションが `http://localhost:3000` で提供されると、以下のように表示されます：

![Nuxt3 setup](/nuxt3-setup.png)

## Nuxt 3 アプリケーションのローカライズ

これまで、Vue I18n を Nuxt 3 アプリケーションに統合することができました。言語切り替えを実装し、外部からロケールリソースをインポートしましょう。

言語切り替えを実装することで、Nuxt 3 アプリケーションを効果的に i18n 化しています。 🌎 🌍 🌏

また、ロケールリソースをソースコードから分離（外部化）すると、ローカリゼーションサービスの助けを借りて、別のワークフローを使用してアプリをローカライズできます。

以下のセクションでは、Nuxt 3 アプリでの英語、フランス語、日本語のサポートを有効にします。

### 言語切り替えの追加

以下のように `app.vue` に言語切り替え機能を追加します：

```vue
<template>
  <div>
    <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1>
    <form>
      // [!code ++]
      <label for="locale-select">{{ $t('language') }}: </label> // [!code ++]
      <select
        id="locale-select"
        v-model="$i18n.locale"
      >
        // [!code ++]
        <option value="en">
          en
        </option> // [!code ++]
        <option value="fr">
          fr
        </option> // [!code ++]
        <option value="ja">
          ja
        </option> // [!code ++]
      </select> // [!code ++]
    </form> // [!code ++]
  </div>
</template>
```

言語切り替えは、`form` 上の `select` 要素を使用して実装されます。
各オプションの値は、後でロケールリソースの外部化で説明するロケールコードの値として定義されます。

各オプションの値は、後でロケールリソースの外部化で説明するロケールコードの値を定義します。

### ロケールリソースの外部化

ロケールリソースを外部として定義します。

Vue I18n でサポートされているリソースファイル形式はいくつかありますが、この特定のケースでは JSON を選択します。

以下を実行して、`locales` という名前の「Nuxt-3 標準」ではないディレクトリを作成しましょう：

```sh
mkdir locales
```

次に、サポートしたい各ロケールの JSON ファイルを作成しましょう：

```sh
touch locales/en.json # 英語用
touch locales/fr.json # フランス語用
touch locales/ja.json # 日本語用
```

以下のように入力しましょう：

`locales/en.json` の英語：

```json
{
  "hello": "Hello, {name}!",
  "language": "Language"
}
```

`locales/fr.json` のフランス語：

```json
{
  "hello": "Bonjour, {name}!",
  "language": "Langue"
}
```

`locales/ja.json` の日本語：

```json
{
  "hello": "こんにちは、{name}！",
  "language": "言語"
}
```

### ロケールリソースのインポート

プラグイン (`plugins/i18n.ts`) に以下のようにロケールを「登録」しましょう：

<!-- eslint-skip -->

```js
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json' // [!code ++]
import fr from '../locales/fr.json' // [!code ++]
import ja from '../locales/ja.json' // [!code ++]

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      en: { // [!code --]
        hello: "Hello, {name}!" // [!code --]
      } // [!code --]
      en, // [!code ++]
      fr, // [!code ++]
      ja // [!code ++]
    }
  })

  vueApp.use(i18n)
})
```

`messages` オプションは、登録したローカルリソースを保持し、必要に応じて詳細に設定できます。この粒度は、ローカリゼーションサービスとの統合を容易にします。

`npm run dev`（または `yarn dev` または `pnpm dev`）を実行し、`http://localhost:3000` にアクセスして、これまでの変更が機能するかどうかを確認しましょう。

![Setup i18n on Nuxt3](/nuxt3-setup-i18n.gif)

Nuxt 3 アプリケーションは、基本的な国際化の準備が整いました！ 🎉

## `@intlify/unplugin-vue-i18n` による最適化

これまでのところ、Vue I18n を使用して Nuxt 3 アプリケーションでの言語切り替えをサポートできました。また、ロケールリソースを外部化することで、ソースコードから分離し、ロケールリソースの管理とローカリゼーションサービスとの統合を容易にしました。

ただし、[最適化](../advanced/optimization) で説明されているように、これまで準備された Nuxt 3 アプリケーションは、バンドルサイズの点で最適ではありません。

Vue I18n v9 以降、メッセージコンパイラはパフォーマンス向上のためにロケールリソースをプリコンパイルできるようになりましたが、そのパフォーマンスについてはまだ最適化されていません。

パフォーマンスを最適化するための Vue I18n である [@intlify/unplugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) を導入します。

### `@intlify/unplugin-vue-i18n` のインストール

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

### Nuxt 設定の設定

`nuxt.config.ts` を以下のように設定します：

<!-- eslint-skip -->

```js
import { defineNuxtConfig } from 'nuxt'
import { resolve, dirname } from 'node:path' // [!code ++]
import { fileURLToPath } from 'url' // [!code ++]
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite' // [!code ++]

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: { // [!code ++]
    transpile: ['vue-i18n'] // [!code ++]
  }, // [!code ++]
  vite: { // [!code ++]
    plugins: [ // [!code ++]
      VueI18nVitePlugin({ // [!code ++]
        include: [ // [!code ++]
          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json') // [!code ++]
        ] // [!code ++]
      }) // [!code ++]
    ] // [!code ++]
  } // [!code ++]
})
```

Nuxt 3 のデフォルトのバンドラは vite です。したがって、ここでは最適化のために `vite` オプションを使用します。

`vite.plugins` では、`@intlify/unplugin-vue-i18n` のプラグインが設定されています。このプラグインのオプションとして、`include` オプションは `locales` ディレクトリに配置された json 形式のロケールリソースを指定します。これにより、`@intlify/unplugin-vue-i18n` は、バンドル時に内部で Vue I18n メッセージコンパイラを使用してロケールリソースをプリコンパイルできます。これにより、Vue I18n の翻訳パフォーマンスが向上し、結果として Nuxt 3 アプリケーションのレンダリングパフォーマンスが向上します。

### 最適化によるバンドルの内部

設定が完了したら、`npm run dev` を実行して確認してください！

`http://localhost:3000` にアクセスした後、Nuxt 3 アプリケーションの動作は同じままですが、Nuxt 3 アプリケーションの帯域幅に変化があります。

以下は、devtools のネットワークタブで測定された、`@intlify/unplugin-vue-i18n` ありとなしのバンドルサイズの比較です：

![Reduce bundle size](/nuxt3-reduce-bundle-size.png)

青色で強調表示されている領域は、vite によってバンドルされたコードです。

このプラグインを設定することで、プラグインは内部的にランタイムのみの Vue I18n モジュールを設定します。具体的には、vite config `resolve.alias` で、Vue I18n ランタイム (`vue-i18n/dist/vue-i18n.runtime.esm-bundler.js`) のみを使用するように `vue-i18n` エイリアスを設定します。この設定により、Vue I18n で使用されるメッセージコンパイラが含まれないため、バンドルサイズが削減されます。

詳細については、`@intlify/unplugin-vue-i18n` [ドキュメント](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#runtimeonly) を参照してください

また、ロケールリソースのバンドルの変化も確認できます。

ロケールリソースのコードは、`vite.plugins` への `@intlify/unplugin-vue-i18n` プラグインが設定されているかどうかによって異なります。以下：

![Pre-compile](/nuxt3-pre-compile.png)

`vite.plugins` への `@intlify/unplugin-vue-i18n` プラグインがない場合、ロケールリソースは **json** としてバンドルされますが、このプラグインが設定されている場合、ロケールリソースは帯域幅のために json から **JavaScript コードに変換** されます。

Vue I18n は、それらがすでにコンパイルされているため、関数を呼び出すだけです。

このガイドでは、Nuxt 3 アプリケーションが小さいため、最適化のパフォーマンスを十分に体験することはできませんが、アプリケーションが大きくなるにつれて、間違いなくその恩恵を受けることができます。

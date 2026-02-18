# 最適化

## パフォーマンス

「[異なる配布ファイル](../extra/dist#from-cdn-or-without-a-bundler)」セクションで説明されているように、Vue I18n はバンドラ用に以下の 2 つのビルド済み ES モジュールを提供しています。

- メッセージコンパイラ + ランタイム: **`vue-i18n.esm-bundler.js`**
- ランタイムのみ: **`vue-i18n.runtime.esm-bundler.js`**

バンドラの場合、デフォルトで `vue-i18n.esm-bundler.js` を [`@intlify/unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) とバンドルするように設定されています。バンドルサイズをさらに削減したい場合は、ランタイムのみの `vue-i18n.runtime.esm-bundler.js` を使用するようにバンドラを設定できます。

ES モジュール `vue-i18n.runtime.esm-bundler.js` を使用することは、**すべてのロケールメッセージをメッセージ関数または AST リソースにプリコンパイルする必要がある** ことを意味します。つまり、vue-i18n はメッセージ関数のみを実行するため、コンパイルが不要になり、パフォーマンスが向上します。

:::tip NOTE
v9.3 以前では、ロケールメッセージはメッセージ関数にコンパイルされますが、v9.3 以降では、`@intlify/bundle-tools` を使用して AST にコンパイルされます。
:::

:::tip NOTE
v9.3 以前では、すべてのロケールメッセージは `@intlify/unplugin-vue-i18n` でコンパイルされるため、メッセージコンパイラはバンドルされず、**バンドルサイズを削減できます**。

v9.3 以降では、メッセージコンパイラもバンドルされるため、バンドルサイズを削減できません。**これはトレードオフです**。
理由については、[JIT コンパイルの詳細](#jit-コンパイル) を参照してください。
:::

:::danger NOTE
v9.3 以前で [CSP](https://developer.mozilla.org/ja/docs/Web/HTTP/CSP) が有効になっている場合、`eval` ステートメントが使用されているため、`vue-i18n.esm-bundler.js` はコンパイラで動作しません。これらのステートメントは `default-src 'self'` ヘッダーに違反します。代わりに `vue-i18n.runtime.esm-bundler.js` を使用する必要があります。
:::

:::warning NOTICE
v9.3 以降、CSP の問題は vue-i18n メッセージコンパイラの JIT コンパイルによって回避できます。[JIT コンパイルの詳細](#jit-コンパイル) を参照してください。
:::

## 設定方法

一部のバンドラのモジュール解決エイリアス機能（例：`resolve.alias` vite および webpack）を使用して、これらのモジュールパスでモジュールを設定できますが、時間と労力がかかります。
簡単にするために、Intlify プロジェクトは一部のバンドラ用のプラグイン/ローダーを提供しています。

### unplugin-vue-i18n

[`unplugin`](https://github.com/unjs/unplugin) は、vite、webpack、rollup、esbuild などのバンドルツールのための統一プラグインシステムです。

Intlify プロジェクトは、vite および webpack 用に [`unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) を提供しています。

プロダクションビルドを行う場合、Vue I18n は自動的にランタイムのみのモジュールをバンドルします。

#### プラグインのインストール

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


#### vite 用プラグインの設定

<!-- eslint-skip -->

```js
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
      // locale messages resource pre-compile option
      include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
    }),
  ],
})
```

#### webpack 用プラグインの設定

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

#### その他の設定

オプションと機能については、詳細 [ページ](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#intlifyunplugin-vue-i18n) を参照してください


### Quasar CLI

何もする必要はありません。[Quasar CLI](https://quasar.dev) が最適化を処理します。


## 機能ビルドフラグ

### Tree-shaking によるバンドルサイズの削減

`esm-bundler` ビルドでは、コンパイル時に上書きできるグローバル機能フラグが公開されるようになりました：

- `__VUE_I18N_FULL_INSTALL__`（有効/無効、vue-i18n API に加えて、コンポーネントとディレクティブのインストールを完全にサポート：`true`）
- `__VUE_I18N_LEGACY_API__`（有効/無効、vue-i18n レガシースタイル API のサポート。レガシー API は v12 で削除されました、デフォルト：`false`）

ビルドはこれらのフラグを設定しなくても機能しますが、最終的なバンドルで適切な tree shaking を行うために、それらを適切に設定することを **強くお勧めします**。

バンドラの設定方法については、[こちら](#バンドラの機能フラグの設定) を参照してください。

### JIT コンパイル

:::tip Support Version
:new: 9.3+
:::

v9.3 以前、vue-i18n メッセージコンパイラは、AOT（Ahead Of Time）のようにロケールメッセージをプリコンパイルしていました。

しかし、以下の問題がありました：

- CSP の問題：サービス/ウェブワーカー、CDN のエッジサイドランタイムなどで動作させるのが難しい。
- バックエンド統合：API 経由でデータベースなどのバックエンドからメッセージを取得し、動的にローカライズするのが難しい

これらの問題を解決するために、JIT（Just In Time）スタイルのコンパイルがメッセージコンパイラとしてサポートされています。

`$t` または `t` 関数を使用してアプリケーションでローカリゼーションが実行されるたびに、メッセージリソースがメッセージコンパイラ上でコンパイルされます。

`esm-bundler` ビルドと vite などのバンドラで、以下の機能フラグを設定する必要があります：

- `__INTLIFY_JIT_COMPILATION__`（有効/無効、JIT スタイルのメッセージコンパイラ、デフォルト：`false`）
- `__INTLIFY_DROP_MESSAGE_COMPILER__`（有効/無効、バンドル時にメッセージコンパイラを tree-shake するかどうか、このフラグは `__INTLIFY_JIT_COMPILATION__` が有効な場合に機能します。デフォルト：`false`）

:::warning NOTICE
この機能は、v9.3 以前のバージョンとの互換性のため、デフォルトでは無効になっています。
:::

:::warning NOTICE
v10 以降、JIT コンパイルはデフォルトで有効になっているため、バンドラで `__INTLIFY_JIT_COMPILATION__` フラグを設定する必要はなくなりました。
:::

バンドラの設定方法については、[こちら](#バンドラの機能フラグの設定) を参照してください。


### バンドラの機能フラグの設定

- webpack: [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) を使用
- Rollup: [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) を使用
- Vite: デフォルトで設定されていますが、[`define` オプション](https://github.com/vitejs/vite/blob/a4133c073e640b17276b2de6e91a6857bdf382e1/src/node/config.ts#L72-L76) を使用して上書きできます
- Quasar CLI: デフォルトで設定されていますが、quasar.conf.js > build > rawDefine を使用して上書きできます

:::tip NOTE
置換値は **ブールリテラルである必要があり**、文字列にすることはできません。そうしないと、バンドラ/ミニファイアが条件を適切に評価できなくなります。
:::


## 拡張機能による事前翻訳

vue-i18n-extensions パッケージを使用して、事前翻訳（サーバーサイドレンダリング）を使用できます。

使用方法については、[こちら](https://github.com/intlify/vue-i18n-extensions) を参照してください。

## SSR (サーバーサイドレンダリング)

### SSR 用プラグインの設定

SSR アプリケーションの場合、[@intlify/unplugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#ssr) で `ssr` オプションを設定する必要があります：

<!-- eslint-skip -->

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  plugins: [
    VueI18nPlugin({
      ssr: true, // SSR サポートを有効にする
    }),
  ],
})
```

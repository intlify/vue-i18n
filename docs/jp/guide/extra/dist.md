# 異なる配布ファイル

[npm パッケージの dist/ ディレクトリ](https://cdn.jsdelivr.net/npm/vue-i18n@9.1.10/dist/) には、Vue I18n のさまざまなビルドがあります。ここでは、ユースケースに応じてどの dist ファイルを使用すべきかの概要を説明します。

## CDN またはバンドラなし

- **`vue-i18n(.runtime).global(.prod).js`**:
  - ブラウザで `<script src="...">` を介して直接使用する場合。`VueI18n` グローバルを公開します
  - ブラウザ内メッセージフォーマットコンパイル:
    - `vue-i18n.global.js` は、コンパイラとランタイムの両方を含む「完全な」ビルドであるため、メッセージフォーマットのオンザフライコンパイルをサポートします
    - `vue-i18n.runtime.global.js` はランタイムのみを含み、ビルドステップ中にメッセージフォーマットをプリコンパイルする必要があります
  - すべての Vue I18n コア内部パッケージをインライン化します。つまり、他のファイルへの依存関係がない単一のファイルです。これは、同じコードインスタンスを取得するために、**必ず** このファイルからすべてをインポートし、このファイルのみからインポートする必要があることを意味します
  - ハードコードされた prod/dev ブランチが含まれており、prod ビルドは事前に縮小されています。本番環境には `*.prod.js` ファイルを使用してください

:::tip NOTE
グローバルビルドは [UMD](https://github.com/umdjs/umd) ビルドではありません。これらは [IIFE](https://developer.mozilla.org/ja/docs/Glossary/IIFE) として構築されており、`<script src="...">` を介して直接使用することのみを目的としています。
:::

- **`vue-i18n(.runtime).esm-browser(.prod).js`**:
  - ネイティブ ES モジュールインポートを介した使用（ブラウザでは `<script type="module">` を介して）
  - グローバルビルドと同じランタイムコンパイル、依存関係のインライン化、およびハードコードされた prod/dev 動作を共有します

## バンドラを使用する場合

- **`vue-i18n(.runtime).esm-bundler.js`**:
  - `webpack`、`rollup`、`parcel` などのバンドラで使用する場合
  - `process.env`<wbr/>`.NODE_ENV` ガードを使用して prod/dev ブランチを残します（バンドラによって置換される必要があります）
  - 縮小されたビルドを出荷しません（バンドル後に残りのコードと一緒に実行されます）
  - 依存関係をインポートします（例：`@intlify/core-base`、`@intlify/message-compiler`）
    - インポートされた依存関係も `esm-bundler` ビルドであり、順番にそれらの依存関係をインポートします（例：`@intlify/message-compiler` は `@intlify/shared` をインポートします）
    - これは、これらの依存関係の異なるインスタンスで終わることなく、これらの依存関係を個別にインストール/インポート **できる** ことを意味しますが、それらすべてが同じバージョンに解決されることを確認する必要があります
  - ブラウザ内ロケールメッセージコンパイル:
    - **`vue-i18n.runtime.esm-bundler.js`** はランタイムのみであり、すべてのロケールメッセージをプリコンパイルする必要があります。バンドラを使用する場合、テンプレートは通常プリコンパイルされるため（例：`*.json` ファイル内）、これはバンドラのデフォルトエントリです（`package.json` の `module` フィールドを介して）
    - **`vue-i18n.esm-bundler.js` (デフォルト)**: ランタイムコンパイラが含まれています。バンドラを使用しているが、ロケールメッセージのコンパイル（例：インライン JavaScript 文字列を介したテンプレート）が必要な場合は、これを使用します。このビルドを使用するには、インポートステートメントを次のように変更します：`import { createI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";`

:::tip NOTE
`vue-i18n.runtime.esm-bundler.js` を使用する場合、すべてのロケールメッセージをプリコンパイルする必要があります。これは、`.json` (`.json5`) または `.yaml`、i18n カスタムブロックを使用して i18n リソースを管理することで実行できます。したがって、バンドラと以下のローダー/プラグインを使用して、すべてのロケールメッセージをプリコンパイルすることになります。

- [`@intlify/unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)
:::

## Node.js (サーバーサイド) 用

- **`vue-i18n(.runtime).node.js`**:
  - Node.js での ES モジュール使用法
  - `import` を介して Node.js で使用する場合
  - dev/prod ファイルは事前にビルドされていますが、`process.env`<wbr/>`.NODE_ENV` に基づいて適切なファイルが自動的に要求されます
  - このモジュールは `vue-i18n(.runtime).js` のプロキシモジュールです
    - **`vue-i18n.runtime.node.js`**: ランタイムのみです。
    - **`vue-i18n.node.js`**: ランタイムコンパイラが含まれています。
</toolcall_result>

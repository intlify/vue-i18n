# サードパーティツール

## Sherlock – i18n inspector (VS Code 拡張機能)

Sherlock は、コードベース内の i18n キーの抽出、編集、検査に役立つ VS Code 拡張機能です。[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension) で入手できます。

Sherlock は inlang エコシステムの一部であり、[Figma プラグイン](https://inlang.com/m/gkrpgoir/app-parrot-figmaPlugin)、[Web エディタ](https://inlang.com/m/tdozzpar/app-inlang-finkLocalizationEditor)、[GitHub Action](https://inlang.com/m/3gk8n4n4/app-inlang-ninjaI18nAction) など、i18n 開発に優れた開発者体験を提供する複数のアプリを提供します。

## i18n Ally

[i18n Ally](https://marketplace.visualstudio.com/items?itemName=antfu.i18n-ally) は、VSCode 用の i18n 拡張機能です。

i18n Ally は、i18n 開発に優れた開発者体験を提供します。

i18n Ally の詳細については、[README](https://github.com/antfu/i18n-ally/blob/master/README.md) を参照してください。

## i18nPlugin (intellij プラットフォーム)

[i18nPlugin](https://github.com/nyavro/i18nPlugin) Intellij idea i18next サポートプラグイン ([JetBrains プラグインページ](https://plugins.jetbrains.com/plugin/12981-i18n-support))。

i18n typescript/javascript/PHP 用のプラグイン。vue-i18n をサポートしています。vue-i18n サポートを有効にするには、設定 -> ツール -> i18n プラグイン設定に移動し、"Vue-i18n" をチェックします。vue ロケールディレクトリ（デフォルトは locales）を設定する必要があります。

## Easy I18n (intellij プラットフォーム)

IntelliJ IDEA ベースの IDE 用の翻訳ヘルパー。専用の言語ファイルが必要です。機能: `ツリー/テーブルビュー` / `検索フィルター` / `欠落している翻訳の表示` / `クイック CRUD 操作`。

[JetBrains Marketplace](https://plugins.jetbrains.com/plugin/16316-easy-i18n) // [GitHub リポジトリ](https://github.com/marhali/easy-i18n)

## BabelEdit

[BabelEdit](https://www.codeandweb.com/babeledit) は、Web アプリ用の翻訳エディタです。

BabelEdit は `json` ファイルを翻訳でき、単一ファイルコンポーネントの `i18n` カスタムブロックも翻訳できます。

BabelEdit の詳細については、[チュートリアルページ](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-vue-app-with-vue-i18n)を参照してください。

## vue-i18n-extract

[vue-i18n-extract](https://github.com/pixari/vue-i18n-extract) は、vue-i18n に基づく Vue.js プロジェクトに対して静的分析を実行し、次の情報を報告します。

- すべての**未使用の vue-i18n キー**のリスト（言語ファイルにはあるがプロジェクトでは使用されていないエントリ）
- すべての**欠落しているキー**のリスト（プロジェクトにはあるが言語ファイルにはないエントリ）

出力をコンソールに表示したり、json ファイルに書き込んだりできます。

欠落しているキーを、指定された言語ファイルに自動的に追加することもできます。

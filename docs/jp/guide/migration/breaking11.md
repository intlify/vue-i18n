# v11 破壊的変更

## Legacy API モードの非推奨化

### 理由

Legacy API モードは、Vue 2 用の v8 と互換性のある API モードでした。v9 がリリースされたとき、v8 から v9 への移行をスムーズにするために Legacy API が提供されました。

以前の vue-i18n リリースでは、Composition API モードへの移行をサポートするために以下を提供しているため、Legacy API モードは v11 で非推奨になります。

- Legacy API モードから Composition API モードへの移行: https://vue-i18n.intlify.dev/guide/migration/vue3.html
- Composition API の使用法: https://vue-i18n.intlify.dev/guide/advanced/composition.html

互換性のため、Legacy API モードは v11 でも機能しますが、v12 で完全に削除されるため、それ以降のバージョンでは Legacy API モードは機能しません。

## カスタムディレクティブ `v-t` の非推奨化

### 理由

`v-t` の利点は、vue コンパイラ変換と `vue-i18n-extension` の事前翻訳を使用してパフォーマンスを最適化できることでした。

この機能は Vue 2 からサポートされていました。
詳細については、ブログ記事を参照してください: https://medium.com/@kazu_pon/performance-optimization-of-vue-i18n-83099eb45c2d

Vue 3 では、Composition API により、`vue-i18n-extension` の事前翻訳はグローバルスコープのみに制限されるようになりました。

さらに、Vue 3 の仮想 DOM 最適化が導入され、`vue-i18n-extension` による最適化はあまり効果的ではなくなりました。SSR の設定が必要になり、`v-t` を使用する利点はなくなりました。また、`v-t` を使用したテンプレートの DX（開発者体験）は良くありません。カスタムディレクティブは、エディタ（vscode など）でのキー補完では機能しません。

互換性のため、`v-t` モードは v11 でも機能しますが、v12 で完全に削除されるため、それ以降のバージョンでは `v-t` は機能しません。

### 移行

`eslint-plugin-vue-i18n` を使用できます。

`eslint-plugin-vue-i18n` には `@intlify/vue-i18n/no-deprecated-v-t` ルールがあります。https://eslint-plugin-vue-i18n.intlify.dev/rules/no-deprecated-v-t.html

vue-i18n v11 にアップグレードする前に、eslint を使用して移行する必要があります

## Legacy API モードの `tc` と `$tc` の廃止

**理由**: これらの API はすでに非推奨であり、v11 で削除されるという警告が表示されています。ドキュメントには次のように記載されています: https://vue-i18n.intlify.dev/guide/migration/breaking10.html#deprecate-tc-and-tc-for-legacy-api-mode

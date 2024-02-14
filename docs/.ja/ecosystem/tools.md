# Third-party tooling

## Nuxt I18n Module

[Nuxt I18n (@nuxtjs/i18n)](https://github.com/nuxt-modules/i18n/) fully integrates Vue I18n for Nuxt 3 (v8 and higher). 

The module adds features such as localized routing, SEO tags and more.

Read more about Nuxt I18n in the docs at [i18n.nuxtjs.org](https://i18n.nuxtjs.org/)

## BabelEdit

[BabelEdit](https://www.codeandweb.com/babeledit) is translation editor for web apps.

BabelEdit can translate `json` files, and it can also translate `i18n` custom block of Single-file components.

Read more about BabelEdit in [tutorial page](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-vue-app-with-vue-i18n).

## i18n Ally

[i18n Ally](https://marketplace.visualstudio.com/items?itemName=antfu.i18n-ally) is i18n extension for VSCode.

The i18n Ally give awesome developer experience for your i18n development.

Read more about i18n Ally in [README](https://github.com/antfu/i18n-ally/blob/master/README.md).

## i18nPlugin (intellij platform)

[i18nPlugin](https://github.com/nyavro/i18nPlugin) Intellij idea i18next support plugin ( [JetBrains plugin page ](https://plugins.jetbrains.com/plugin/12981-i18n-support)).

Plugin for i18n typescript/javascript/PHP. Supports vue-i18n. To enable vue-i18n support go to settings -> Tools -> i18n Plugin configuration and check "Vue-i18n". You need set vue locales directory (locales by default).

## Easy I18n (intellij platform)

Translation helper for IntelliJ IDEA based IDE's. Requires dedicated language files. Features: `Tree-/Table-View` / `Search filter` / `Indication of missing translations` / `Quick CRUD operations`.

[JetBrains Marketplace](https://plugins.jetbrains.com/plugin/16316-easy-i18n) // [GitHub Repository](https://github.com/marhali/easy-i18n)

## vue-i18n-extract

[vue-i18n-extract](https://github.com/pixari/vue-i18n-extract) performs static analysis on a Vue.js project based on vue-i18n and reports the following information:

- list of all the **unused vue-i18n keys** (entries found in the language files but not used in the project)
- list of all the **missing keys** (entries fond in the project but not in the language files)

It’s possible to show the output in the console or to write it in a json file.

The missing keys can be also automatically added to the given language files.

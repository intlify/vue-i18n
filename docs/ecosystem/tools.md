# Third-party tooling

## eloqnt/cli

[eloqnt/cli](https://cli.eloqnt.dev/docs) is a linter and AI translator for translation files.

With [`@eloqnt/format-vue-i18n-json`](https://cli.eloqnt.dev/docs/formats/vue-i18n-json), it can read the vue-i18n message format and reports errors in translation files:

- keys that no longer exist in the source locale
- interpolations and markup that don't match the source message
- missing translations, structural differences and more

Missing translations can optionally be filled in with [`eloqnt translate`](https://cli.eloqnt.dev/docs/cli/translate).

## Locale Guard

[Locale Guard](https://github.com/Mohamed-Almarag/locale-guard) checks translation files on every pull request, as a GitHub Action, and before each commit, as a CLI on npm ([`locale-guard-cli`](https://www.npmjs.com/package/locale-guard-cli)).

It reads vue-i18n messages with `@intlify/message-compiler` and reports:

- keys missing from a locale, with a block of the missing keys ready to paste
- named, list and linked placeholders (`{name}`, `{0}`, `@:common.save`) that don't match the source message
- messages that don't compile, and links to keys that don't exist
- empty values and text that was never translated

It compares a pull request with its base branch, so only the issues it adds fail the check. It works with Nuxt (`@nuxtjs/i18n`) and with JSON or YAML files.

## Sherlock – i18n inspector (VS Code extension)

Sherlock is a VS Code extension that helps you to extract, edit & inspect your i18n keys in your codebase. It is available in the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension).

Sherlock is part of the inlang ecosystem, which gives you multiple apps with awesome developer experience for your i18n development, like a [Figma plugin](https://inlang.com/m/gkrpgoir/app-parrot-figmaPlugin), a [web editor](https://inlang.com/m/tdozzpar/app-inlang-finkLocalizationEditor) or a [GitHub Action](https://inlang.com/m/3gk8n4n4/app-inlang-ninjaI18nAction).


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

## BabelEdit

[BabelEdit](https://www.codeandweb.com/babeledit) is translation editor for web apps.

BabelEdit can translate `json` files, and it can also translate `i18n` custom block of Single-file components.

Read more about BabelEdit in [tutorial page](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-vue-app-with-vue-i18n).

## vue-i18n-extract

[vue-i18n-extract](https://github.com/pixari/vue-i18n-extract) performs static analysis on a Vue.js project based on vue-i18n and reports the following information:

- list of all the **unused vue-i18n keys** (entries found in the language files but not used in the project)
- list of all the **missing keys** (entries fond in the project but not in the language files)

It’s possible to show the output in the console or to write it in a json file.

The missing keys can be also automatically added to the given language files.
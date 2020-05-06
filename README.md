# vue-i18n-next

Internationalization plugin for Vue.js

<h3>Silver Sponsors</h3>

<p>
  <a href="https://www.codeandweb.com/babeledit?utm_campaign=vue-i18n-2019-01" target="_blank">
    <img src="https://raw.githubusercontent.com/kazupon/vue-i18n/dev/vuepress/.vuepress/public/patrons/babeledit.png">
  </a>
</p>

<h3>Bronze Sponsors</h3>

<p>
  <a href="https://zenarchitects.co.jp/" target="_blank">
    <img src="https://raw.githubusercontent.com/kazupon/vue-i18n/v8.x/vuepress/.vuepress/public/patrons/zenarchitects.png">
  </a>
</p>

<br/>


## Status: Alpha ![Test](https://github.com/intlify/vue-i18n-next/workflows/Test/badge.svg)

The current codebase has most of the existing features on Vue I18n v8.x and is usable.

Since the library is still unstable **and because we want feedback** on bugs and missing features, **it will probably go through a few breaking changes**.

If you use stable Vue I18n version, see this [repository](https://github.com/kazupon/vue-i18n)

## :star: New Features

### Composable API

New style API for Vue 3. See the following docs:

- [createI18n](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.createi18n.md)
  - [I18nOptions](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.i18noptions.md)
  - [ComposerOptions](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.composeroptions.md)
  - [VueI18nOptions](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.vuei18noptions.md)
- [useI18n](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.usei18n.md)
  - [ComposerOptions](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.composeroptions.md)
- [Composer](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.composer.md)
- [VueI18n](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.vuei18n.md)

### `<i18n-t>` Component (formerly called `<i18n>` component)

You can use pluralization on the component. See the blow examples:

- [Example with using Composable API](https://github.com/intlify/vue-i18n-next/blob/master/examples/composable/components/translation.html)
- [Example with using Legacy API](https://github.com/intlify/vue-i18n-next/blob/master/examples/legacy/components/translation.html)

### `<i18n-d>` Component

You can use datetime format on the component, like `<i18n-n>` component.

See the below examples:

- [Example with using Composable API](https://github.com/intlify/vue-i18n-next/blob/master/examples/composable/components/datetime-format.html)
- [Example with using Legacy API](https://github.com/intlify/vue-i18n-next/blob/master/examples/legacy/components/datetime-format.html)


## :lollipop: Examples

See the [`examples`](https://github.com/intlify/vue-i18n-next/tree/master/examples) directory.

The examples are offered that use the following two API styles:

- composable
  - Examples with using new vue-i18n API optimized for Vue 3
- legacy
  - Examples with using vue-i18n API that almost compatible with vue-i18n v8.x


## :heavy_exclamation_mark: Known issues

### :boom: Breaking changes compared to vue-i18n v8.x

#### APIs
- The return value of `$t` and `t` methods is **string** only. object and array values ​​are no longer returned.
- The return value of `$tc` and `tc` methods is **string** only. object and array values ​​are no longer returned.
- `VueI18n` class cannot used with `new`. It can only be used via the `$i18n` property of Vue instance.
  - In vue-i18n-next, by replacing `new VueI18n` with `createI18n`, you can use existing `VueI18n` options as they are.
  - See the `examples/legacy` directory.
- `VueI18n.prototype.getChoiceIndex`
  - -> Legacy API style: `pluralizationRules` option of `createI18n` factory function (like `new VueI18n(...)`)
  - -> Compsable API style: `pluralRules` option of `createI18nComposer` factory function
- `warnHtmlInMessage` option:
  - Composable API: `warnHtmlMessage` boolean property, default `true`.
  - Legacy API: `warnHtmlInMessage` property.
  - For development mode, warning is default.
  - For production mode, HTML message detect is not check due to performance.
- Legacy API `sync` option:
  - default: change to `false` from `true`
- `v-t` directive
  - `preserve` modifier deprecated, keep Element content
  - Legacy API `preserveDirectiveContent` option, and property deprecated
- `VueI18n.version` -> `import { VERSION } from 'vue-i18n'`
- `VueI18n.availabilities` -> `import { availabilities } from 'vue-i18n'`
- See the details [here](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.md)

#### Components
- `<i18n>` component
  - Rename to `<i18n-t>` component
  - Remove the below props:
    - `place` prop
    - `places` prop
    - `path` prop (Rename to `keypath` prop)

### :zap: Improvements

- See the [vue-i18n issues](https://github.com/kazupon/vue-i18n/issues?q=is%3Aissue+is%3Aopen+label%3A%22Status%3A+Ready%22) that labeld with `Status: Ready`


### :hammer: Missing features

- SSR
- Custom formatting
- Tooling
  - `@intlify/devtools`
  - `vue-cli-plugin-i18n`
  - `@intlify/rollup-plugin-vue-i18n`
  - `@intlify/vue-i18n-extensions`
  - `@intlify/eslint-plugin-vue-i18n`


## :cd: Installation

### npm

```bash
npm install --save vue-i18n@next
```

### yarn
```bash
yarn add vue-i18n@next
```


## :white_check_mark: TODOs
<details>

- Intlify message format compiler
  - [x] vue-i18n message format
  - [ ] sourcemap
  - [x] HTML format handling
  - [ ] more unit (fuzzing) tests
  - [ ] performance tests (benchmark)
- Intlify core runtime
  - [x] translate function
  - [x] datetime function
  - [x] number function
  - [x] warnHtmlMessage
  - [x] improve translate `args` typing
  - [ ] improve locale messages typing: `LocaleMessages` / `LocaleMessage` / `LocaleMessageDictiory`
  - [x] postTranslation context option
- Composable API: I18n Composer
  - [ ] error handlings
  - properties
    - [x] locale
    - [x] fallbackLocale
    - [x] inheritLocale
    - [x] availableLocales
    - [x] messages
    - [x] modifiers
    - [x] pluralRules
    - [x] missingWarn
    - [x] fallbackWarn
    - [x] fallbackRoot
    - [x] fallbackFormat
    - [x] dateTimeFormats
    - [x] numberFormats
    - [x] warnHtmlMessage
  - methods
    - [x] t
    - [x] getLocaleMessages
    - [x] setLocaleMessages
    - [x] mergeLocaleMessages
    - [x] d
    - [x] getDateTimeFormat
    - [x] setDateTimeFormat
    - [x] mergeDateTimeFormat
    - [x] n
    - [x] getNumberFormat
    - [x] setNumberFormat
    - [x] mergeNumberFormat
    - [x] getPostTranslationHandler
    - [x] setPostTranslationHandler
    - [x] getMissingHandler
    - [x] setMissingHandler
- Legacy API: compatible supporting
  - VueI18n
    - [x] locale
    - [x] fallbackLocale
    - [x] sync
    - [x] availableLocales
    - [x] messages
    - [x] pluralizationRules
    - [x] dateTimeFormats
    - [x] numberFormats
    - [x] formatter
    - [x] missing
    - [x] silentTranslationWarn
    - [x] silentFallbackWarn
    - [x] formatFallbackMessages
    - [x] preserveDirectiveContent
    - [x] warnHtmlInMessage
    - [x] postTranslation
    - [x] t
    - [x] tc
    - [x] te
    - [x] getLocaleMessage
    - [x] setLocaleMessage
    - [x] mergeLocaleMessage
    - [x] d
    - [x] getDateTimeFormat
    - [x] setDateTimeFormat
    - [x] mergeDateTimeFormat
    - [x] n
    - [x] getNumberFormat
    - [x] setNumberFormat
    - [x] mergeNumberFormat
    - [x] getChoiceIndex
  - Inejctted in Vue Prototype API
    - [x] $i18n
    - [x] $t
    - [x] $tc
    - [x] $te
    - [x] $d
    - [x] $n
  - Component options
    - [x] messages
    - [x] pluralRule
    - [x] dateTimeFormats
    - [x] numberFormats
    - [x] sharedMessages
  - [x] plugin install & mixin
  - [x] version
  - [x] IntlAvailability availabilities
- Components
  - [x] Translation `<i18n-t>`
  - [x] NumberFormat `<i18n-n>`
  - [x] DatetimeFormat `<i18n-d>`
- Directive
  - [x] `v-t`
- Tool Chains
  - [ ] intlify devtools
  - [ ] vue-i18n-extensions
  - [x] vue-i18n-loader
  - [ ] rollup-plugin-vue-i18n
  - [ ] vue-cli-plugin-i18n
  - [ ] eslint-plugin-vue-i18n
- Others
  - [ ] documentation
  - [x] fallback localization (bubble up)
  - [ ] SSR
- General tasks
  - [ ] error handlings
  - [ ] unit testings with @vue/test-utils@next

</details>


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)

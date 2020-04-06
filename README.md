# vue-i18n-next

Internationalization plugin for Vue.js

<h3>Silver Sponsors</h3>

<p>
  <a href="https://www.codeandweb.com/babeledit?utm_campaign=vue-i18n-2019-01" target="_blank">
    <img src="https://raw.githubusercontent.com/kazupon/vue-i18n/dev/vuepress/.vuepress/public/patrons/babeledit.png">
  </a>
</p>

<p>
  <a href="https://www.patreon.com/kazupon" target="_blank">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patreon">
  </a>
</p>

<br/>


## Status: WIP ![Test](https://github.com/intlify/vue-i18n-next/workflows/Test/badge.svg)

The current codebase has most of the existing features on Vue I18n v8.x and is usable.

Since the library is still unstable **and because we want feedback** on bugs and missing features, **it will probably go through a few breaking changes**.

If you use stable Vue I18n version, see this [repository](https://github.com/kazupon/vue-i18n)


## :star: New Features

- `Composable API`: new style API for Vue 3
   - See the following docs:
   - [createI18n](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.createi18ncomposer.md)
   - [I18nComposerOptions](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.i18ncomposeroptions.md)
   - [I18nComposer](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.i18ncomposer.md)
   - [useI18n](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.usei18n.md)



## :lollipop: Examples

See the [`examples`](https://github.com/intlify/vue-i18n-next/tree/master/examples) directory.

The examples are offered that use the following two API styles:

- composable
  - new vue-i18n API optimized for Vue 3. details about API
- legacy
  - vue-i18n API almost compatible with vue-i18n@8.x


## :heavy_exclamation_mark: Known issues

### :boom: Breaking changes compared to vue-i18n@8.x

- API
  - The return value of `$t` and `t` methods is **string** only. object and array values ​​are no longer returned.
  - The return value of `$tc` and `tc` methods is **string** only. object and array values ​​are no longer returned.
  - `VueI18n` class cannot used with `new`. It can only be used via the `$i18n` property of Vue instance.
    - In vue-i18n-next, by replacing `new VueI18n` with `createI18n`, you can use existing `VueI18n` options as they are.
    - See the `examples/legacy` directory.
  - `VueI18n.prototype.getChoiceIndex`
    - -> Legacy API style: `pluralizationRules` option of `createI18n` factory function (like `new VueI18n(...)`)
    - -> Compsable API style: `pluralRules` option of `createI18nComposer` facatory function
  - `VueI18n.version` -> `import { VERSION } from 'vue-i18n'`
  - `VueI18n.availabilities` -> `import { availabilities } from 'vue-i18n'`
  - See the details [here](https://github.com/intlify/vue-i18n-next/blob/master/docs/vue-i18n.md)

### :zap: Improvements

- See the [vue-i18n issues](https://github.com/kazupon/vue-i18n/issues?q=is%3Aissue+is%3Aopen+label%3A%22Status%3A+Ready%22) that labeld with `Status: Ready`


### :hammer: Missing features

- imporve `fallbackLocale` or `fallbackLocales` (related vue-i18n [issue](https://github.com/kazupon/vue-i18n/pull/829))
- `<i18n>` custom block supporting for SFC
- `v-t` directive
- `preserveDirectiveContent` option (depend on `v-t`)
- Compoonent interpolation with `<i18n>` component
- Number custom formatting with `<i18n-n>` component
- HTML format suppression with `warnHtmlInMessage` option
- SSR
- Custom formatting
- Tooling
  - `vue-cli-plugin-i18n`
  - `@intlify/vue-i18n-loader`
  - `@intlify/rollup-plugin-vue-i18n`
  - `@intlify/vue-i18n-extensions`
  - `@intlify/eslint-plugin-vue-i18n`


## :white_check_mark: TODOs
<details>

- Intlify message format compiler
  - [x] vue-i18n message format
  - [ ] sourcemap
  - [ ] error handling
  - [ ] more unit tests!
- Intlify core runtime
  - [x] translate function
  - [x] datetime function
  - [x] number function
  - [ ] warnHtmlInMessage
  - [x] improve translate `args` typing
  - [ ] improve locale messages typing: `LocaleMessages` / `LocaleMessage` / `LocaleMessageDictiory`
  - [x] postTranslation context option
- Composable API: I18n Composer
  - properties
    - [x] locale
    - [x] fallbackLocales
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
    - [ ] preserveDirectiveContent
    - [ ] warnHtmlInMessage
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
  - [ ] Interpolocation `<i18n>`
  - [ ] NumberFormat `<i18n-n>`
- Directive
  - [ ] `v-t`
- Tool Chains
  - [ ] vue-i18n-extensions
  - [ ] vue-i18n-loader
  - [ ] rollup-plugin-vue-i18n
  - [ ] vue-cli-plugin-i18n
  - [ ] eslint-plugin-vue-i18n
- Others
  - [ ] documentation
  - [x] fallback localization (bubble up)
  - [ ] SSR

</details>


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)

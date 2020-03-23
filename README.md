<p align="center"><img width="128px" height="112px" src="./assets/vue-i18n-logo.png" alt="Vue I18n logo"></p>
<h1 align="center">vue-i18n</h1>
<p align="center">
  <a href="https://circleci.com/gh/kazupon/vue-i18n/tree/dev"><img src="https://circleci.com/gh/kazupon/vue-i18n/tree/dev.svg?style=shield" alt="Build Status"></a>
  <a href="https://codecov.io/gh/kazupon/vue-i18n"><img src="https://codecov.io/gh/kazupon/vue-i18n/branch/dev/graph/badge.svg" alt="Coverage Status"></a>
  <a href="http://badge.fury.io/js/vue-i18n"><img src="https://badge.fury.io/js/vue-i18n.svg" alt="NPM version"></a>
  <a href="https://discord.gg/4yCnk2m"><img src="https://img.shields.io/badge/Discord-join%20chat-738bd7.svg" alt="vue-i18n channel on Discord"></a>
  <a href="https://devtoken.rocks/package/vue-i18n"><img src="https://badge.devtoken.rocks/vue-i18n" alt="vue-i18n Dev Token"></a>
</p>

<p align="center">Internationalization plugin for Vue.js</p>

<h3 align="center">Silver Sponsors</h3>

<p align="center">
  <a href="https://www.codeandweb.com/babeledit?utm_campaign=vue-i18n-2019-01" target="_blank">
    <img src="https://raw.githubusercontent.com/kazupon/vue-i18n/dev/vuepress/.vuepress/public/patrons/babeledit.png">
  </a>
</p>

<p align="center">
  <a href="https://www.patreon.com/kazupon" target="_blank">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patreon">
  </a>
</p>

<br/>

# :warning: NOTICE: !!!!! vue-i18n is WIP for Vue 3 !!!!!

if you use currently vue-i18n version, see this [repository](https://github.com/kazupon/vue-i18n)

## TODO:
- Intlify message format compiler
  - [x] vue-i18n message format
  - [ ] sourcemap
  - [ ] error handling
  - [ ] more unit tests!
- Intlify core runtime
  - [x] localize function
  - [ ] datetime function
  - [ ] number function
  - [ ] localize `args` typing
  - [ ] improve locale messages typing: `LocaleMessages` / `LocaleMessage` / `LocaleMessageDictiory`
- composable API: I18n Composer
  - properties
    - [x] locale
    - [x] fallbackLocales
    - [x] missingWarn
    - [x] fallbackWarn
  - methods
    - [-] t
    - [ ] d
    - [ ] n
    - [x] getMissingHandler
    - [x] setMissingHandler
    - [ ] getLocaleMessages
    - [ ] setLocaleMessages
- legacy API compatible supporting
  - VueI18n
    - [ ] messages
    - [ ] dateTimeFormats
    - [ ] numberFormats
    - [ ] availableLocales
    - [ ] locale
    - [ ] fallbackLocale
    - [ ] missing
    - [ ] formatter
    - [ ] formatFallbackMessages
    - [ ] silentTranslationWarn
    - [ ] silentFallbackWarn
    - [ ] preserveDirectiveContent
    - [ ] pluralizationRules
    - [ ] warnHtmlInMessage
    - [ ] t
    - [ ] tc
    - [ ] te
    - [ ] d
    - [ ] n
    - [ ] getLocaleMessage
    - [ ] setLocaleMessage
    - [ ] mergeLocaleMessage
    - [ ] getDateTimeFormat
    - [ ] setDateTimeFormat
    - [ ] mergeDateTimeFormat
    - [ ] getNumberFormat
    - [ ] setNumberFormat
    - [ ] mergeNumberFormat
    - [ ] getChoiceIndex
  - Inejctted in Vue Prototype API
    - [ ] $i18n
    - [ ] $t
    - [ ] $tc
    - [ ] $te
    - [ ] $d
    - [ ] $n
  - [-] plugin install & mixin
  - [ ] version
  - [x] IntlAvailability availabilities
- Components
  - [ ] Interpolocation `<i18n>`
  - [ ] Number `<i18n-n>`
- Directive
  - [ ] `v-t`
- Tool Chains
  - [ ] vue-i18n-extensions
  - [ ] vue-i18n-loader
  - [ ] rollup-plugin-vue-i18n
  - [ ] vue-cli-plugin-i18n
  - [ ] eslint-plugin-vue-i18n

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)

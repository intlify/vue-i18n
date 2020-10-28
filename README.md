# vue-i18n-next

Internationalization plugin for Vue.js

<h3>🥈 Silver Sponsors</h3>

<p>
  <a href="https://www.codeandweb.com/babeledit?utm_campaign=vue-i18n-2019-01" target="_blank">
    <img src="https://raw.githubusercontent.com/kazupon/vue-i18n/dev/vuepress/.vuepress/public/patrons/babeledit.png">
  </a>
</p>

<h3>🥉 Bronze Sponsors</h3>

<p>
  <a href="https://zenarchitects.co.jp/" target="_blank">
    <img src="https://raw.githubusercontent.com/kazupon/vue-i18n/v8.x/vuepress/.vuepress/public/patrons/zenarchitects.png" width="200px">
  </a>
</p>

<br />
<br />

<p>
  <a href="https://www.sendcloud.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/kazupon/vue-i18n/v8.x/vuepress/.vuepress/public/patrons/sendcloud.png" width="200px">
  </a>
</p>

<br/>
<br/>

## Status: Beta ![Test](https://github.com/intlify/vue-i18n-next/workflows/Test/badge.svg)

The current codebase has most of the existing features on Vue I18n v8.x and is usable.

Since the library is still unstable **and because we want feedback** on bugs and missing features, **it will probably go through a few breaking changes**.

If you use stable Vue I18n version, see this [repository](https://github.com/kazupon/vue-i18n)

## :star: New Features

### Message Format Syntax
- Literal Interpolation
  - You can use a single quote `'` and "Mustache" like (`{` `}` ) to make the message literal.
  - e.g. `foo{'@'}domain.com`
- Message Functions
  - As with Vue's render function, vue-i18n-next (and future releases) support the **Message** functions.
  - Using the Message function has the following advantages:
    - Accelerate evaluation of vue-i18n messages (pre-compilation)
    - Support for complex i18n that cannot be handled by message format

### Composition API

New style API for Vue Composition API. See the following docs:

- [createI18n](https://github.com/intlify/vue-i18n-next/blob/master/docs/api/vue-i18n.createi18n.md)
  - [I18nOptions](https://github.com/intlify/vue-i18n-next/blob/master/docs/api/vue-i18n.i18noptions.md)
  - [ComposerOptions](https://github.com/intlify/vue-i18n-next/blob/master/docs/api/vue-i18n.composeroptions.md)
  - [VueI18nOptions](https://github.com/intlify/vue-i18n-next/blob/master/docs/api/vue-i18n.vuei18noptions.md)
- [useI18n](https://github.com/intlify/vue-i18n-next/blob/master/docs/api/vue-i18n.usei18n.md)
  - [ComposerOptions](https://github.com/intlify/vue-i18n-next/blob/master/docs/api/vue-i18n.composeroptions.md)
- [Composer](https://github.com/intlify/vue-i18n-next/blob/master/docs/api/vue-i18n.composer.md)
- [VueI18n](https://github.com/intlify/vue-i18n-next/blob/master/docs/api/vue-i18n.vuei18n.md)

### `<i18n-t>` Component (formerly called `<i18n>` component)

You can use pluralization on the component. See the below examples:

- [Example with using Composition API](https://github.com/intlify/vue-i18n-next/blob/master/examples/composition/components/translation.html)
- [Example with using Legacy API](https://github.com/intlify/vue-i18n-next/blob/master/examples/legacy/composition/translation.html)

### `<i18n-d>` Component

You can use datetime format on the component, like `<i18n-n>` component.

See the below examples:

- [Example with using Composition API](https://github.com/intlify/vue-i18n-next/blob/master/examples/composition/components/datetime-format.html)
- [Example with using Legacy API](https://github.com/intlify/vue-i18n-next/blob/master/examples/legacy/compostion/datetime-format.html)

## :lollipop: Examples

See the [`examples`](https://github.com/intlify/vue-i18n-next/tree/master/examples) directory.

The examples are offered in thee following two API styles:

- composition
  - Examples with using new vue-i18n API optimized for Vue 3
- legacy
  - Examples with using vue-i18n API that are almost compatible with vue-i18n v8.x


## :heavy_exclamation_mark: Known issues

### :boom: Breaking changes compared to vue-i18n v8.x

#### Message Format Syntax
- Special characters
  - Since vue-i18n-next, the message format syntax is handled by the compiler.
  - The following characters used in the message syntax are processed by the compiler as special characters:
    - `{`, `}`, `@`, `$`, `|`
  - If you want to use these special characters, you can use **literal interpolation** to get around it.

#### APIs
- The return value of `$t` and `t` methods is **string** only. object and array values are no longer returned.
  - As an alternative way, you can use `$tm` / `tm`
- The return value of `$tc` and `tc` methods is **string** only. object and array values are no longer returned.
  - As an alternative way, you can use `$tm` / `tm`
- `VueI18n` class cannot used with `new`. It can only be used via the `$i18n` property of Vue instance.
  - In vue-i18n-next, by replacing `new VueI18n` with `createI18n`, you can use existing `VueI18n` options as they are.
  - See the `examples/legacy` directory.
- `VueI18n.prototype.getChoiceIndex`
  - -> Legacy API style: `pluralizationRules` option of `createI18n` factory function (like `new VueI18n(...)`)
  - -> Compsable API style: `pluralRules` option of `createI18nComposer` factory function
- `warnHtmlInMessage` option:
  - Composition API: `warnHtmlMessage` boolean property, default `true`.
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
  - Remove `Boolean` type from `tag` prop
  - if `tag` prop is not specified, return the Fragment
  - Remove the below props:
    - `place` prop
    - `places` prop
    - `path` prop (Rename to `keypath` prop)
- `<i18n-n>` component
  - Remove `Boolean` type from `tag` prop
  - if `tag` prop is not specified, return the Fragment

### :zap: Improvements

- See the [vue-i18n issues](https://github.com/kazupon/vue-i18n/issues?q=is%3Aissue+is%3Aopen+label%3A%22Status%3A+Ready%22) that are labeled with `Status: Ready`


### :hammer: Missing features

- Custom formatting
- Tooling
  - `@intlify/devtools`
  - `vue-cli-plugin-i18n`
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

## :package: About dist files

### From CDN or without a Bundler

- **`vue-i18n.global(.prod).js`**:
  - For direct use via `<script src="...">` in the browser. Exposes the `VueI18n` global.
  - Note that global builds are not [UMD](https://github.com/umdjs/umd) builds.  They are built as [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and are only meant for direct use via `<script src="...">`.
  - Contains hard-coded prod/dev branches, and the prod build is pre-minified. Use the `*.prod.js` files for production.

- **`vue-i18n.esm-browser(.prod).js`**:
  - For usage via native ES modules imports (in browser via `<script type="module">`.
  - Shares the same runtime compilation, dependency inlining and hard-coded prod/dev behavior with the global build.

### With a Bundler

- **`vue-i18n.esm-bundler.js`**:
  - For use with bundlers like `webpack`, `rollup` and `parcel`.
  - Leaves prod/dev branches with `process.env.NODE_ENV` guards (must be replaced by bundler)
  - Does not ship minified builds (to be done together with the rest of the code after bundling)

#### Bundler Build Feature Flags

Starting with 9.0.0-beta.2, `esm-bundler` builds now exposes global feature flags that can be overwritten at compile time:

- `__VUE_I18N_FULL_INSTALL__` (enable/disable, in addition to vue-i18n APIs, components and directives all fully support installation: `true`)
- `__VUE_I18N_LEGACY_API__` (enable/disable vue-i18n legacy style APIs support, default: `true`)
- `__INTLIFY_PROD_DEVTOOLS__` (enable/disable intlify-devtools and vue-devtools support in production, default: `false`)

The build will work without configuring these flags, however it is **strongly recommended** to properly configure them in order to get proper tree-shaking in the final bundle. To configure these flags:

- webpack: use [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)
- Rollup: use [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace)
- Vite: configured by default, but can be overwritten using the [`define` option](https://github.com/vitejs/vite/blob/a4133c073e640b17276b2de6e91a6857bdf382e1/src/node/config.ts#L72-L76)

Note: the replacement value **must be boolean literals** and cannot be strings, otherwise the bundler/minifier will not be able to properly evaluate the conditions.


## :white_check_mark: TODOs
<details>

- Intlify message format compiler
  - [x] vue-i18n message format
  - [x] sourcemap
  - [x] HTML format handling
  - [ ] more unit (fuzzing) tests
  - [x] performance tests (benchmark)
- Intlify core runtime
  - [x] translate function
  - [x] datetime function
  - [x] number function
  - [x] warnHtmlMessage
  - [x] improve translate `args` typing
  - [x] improve locale messages typing: `LocaleMessages` / `LocaleMessage` / `LocaleMessageDictiory`
  - [x] postTranslation context option
- Composition API: I18n Composer
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
    - [x] escapeParameter
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
    - [x] tm
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
    - [x] escapeParameterHtml
    - [x] postTranslation
    - [x] componentInstanceCreatedListener
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
    - [x] tm
  - Inejctted in Vue Prototype API
    - [x] $i18n
    - [x] $t
    - [x] $tc
    - [x] $te
    - [x] $d
    - [x] $n
    - [x] $tm
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
  - [x] vue-devtools
  - [x] vue-i18n-extensions
  - [x] vue-i18n-loader
  - [x] rollup-plugin-vue-i18n
  - [x] vite-plugin-vue-i18n
  - [ ] vue-cli-plugin-i18n
  - [-] eslint-plugin-vue-i18n
  - [ ] transformer for vue-jest
- Others
  - [ ] documentation
  - [x] fallback localization (bubble up)
  - [x] SSR
- General tasks
  - [x] error handlings
- Next Tasks (v9.1)
  - [ ] monorepo
  - [ ] message format pre-compilation tools

</details>


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)

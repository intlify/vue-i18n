# Small size subset of Vue I18n

:::warning NOTICE
`petite-vue-i18n` **is not still GA.
It will be GA with the release of Vue I18n v10.
:::

`petite-vue-i18n` is an alternative distribution of Vue I18n, which provides only minimal features.

## What is the difference from Vue I18n ?

- The Size is smaller than vue-i18n
  - CDN or without a Bundler
    - Package reduce size: runtime + compiler `~32%`, runtime only `~45%`
    - `petite-vue-i18n`: runtime + compiler `~9.61KB`, runtime only `~5.51KB` (production build, brotli compression)
    - `vue-i18n`: runtime + compiler `~14.18KB`, runtime only `~10.12KB` (production build, brotli compression)
  - ES Modules for browser
    - Package reduce size: runtime + compiler `~32%`, runtime only `~45%`
    - `petite-vue-i18n`: runtime + compiler `~10.51KB`, runtime only `~6.20KB` (production build, brotli compression)
    - `vue-i18n`: runtime + compiler `~15.40KB`, runtime only `~11.12KB` (production build, brotli compression)
  - Application bundle size
    - Reduce size from `vue-i18n`: `~10%` (Code size check measurement of [vue-i18n](https://github.com/intlify/vue-i18n/tree/master/packages/size-check-vue-i18n) and [petite-vue-i18n](https://github.com/intlify/vue-i18n/tree/master/packages/size-check-petite-vue-i18n))
- The legacy API is not supported, **only the composition API**
- The APIs for the following DateTime Formats, Number Formats, and utilities aren’t included. **Translation only**
  - `n`, `$n`
  - `d`, `$d`
  - `rt`, `$rt`
  - `tm`, `$tm`
  - `getDateTimeFormat`, `setDateTimeFormat`, `mergeDateTimeFormat`
  - `getNumberFormat`, `setNumberFormat`, `mergeNumberFormat`
- **The only locale messages that can be handled are simple key-values**. if you can handle hierarchical locale messages, you need to customize them using the API
- The algorithm of local fallback is **the array order** specified in `fallbackLocale`
- Custom directive `v-t` isn’t included
- The following components provided by `vue-i18n` aren’t included
  - Translation `i18n-t`
  - DatetimeFormat `i18n-d`
  - NumberFormat `i18n-n`

## The use case of `petite-vue-i18n`

`vue-i18n` includes various i18n features such as translation, datetimes format and number formats. Some projects may only use translation and not datetime formats.  At the moment, even in that case, the code for that feature is included.

If your project only uses `t` or `$t` API for translation, so we recommended you would use `petite-vue-i18n` better than `vue-i18n`. And your project needs the features of `vue-i18n`, you can smoothly migrate from `petite-vue-i18n` to `vue-i18n`. This means that it’s progressive enhancement.

## Installation

Basically, it’s the same as installing `vue-i18n`. The only difference is that the part of URL or part of path are changed from `vue-i18n` to `petite-vue-i18n`.

### CDN
You need to insert the following scripts to end of `<head>`:

```html
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/petite-vue-i18n"></script>
```

The following is the application code with the script tag:

```html
<script>
const { createApp } = Vue
const { createI18n } = PetiteVueI18n

const i18n = createI18n({
  // something vue-i18n options here ...
})

const app = createApp({
  // something vue options here ...
})

app.use(i18n)
app.mount('#app')
</script>
```

### Package managers

::: code-group

```sh [npm]
npm install petite-vue-i18n@next --save
```

```sh [yarn]
yarn add petite-vue-i18n@next
```

```sh [pnpm]
pnpm add petite-vue-i18n@next
```
:::


```js
import { createApp } from 'vue'
import { createI18n } from 'petite-vue-i18n'

const i18n = createI18n({
  // something vue-i18n options here ...
})

const app = createApp({
  // something vue options here ...
})

app.use(i18n)
app.mount('#app')
```

## Usages

### Hello world

Template:
```html
<div id="app">
  <h1>{{ t('hello world') }}</h1>
</div>
```

Scripts:
```js
const { createApp } = Vue
const { createI18n, useI18n } = PetiteVueI18n
// or for ES modules
// import { createApp } from 'vue'
// import { createI18n } from 'petite-vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      'hello world': 'Hello world!'
    },
    ja: {
      'hello world': 'こんにちは、世界！'
    }
  }
})

// define App component
const App = {
  setup() {
    const { t } = useI18n()
    return { t }
  }
}

const app = createApp(App)

app.use(i18n)
app.mount('#app')
```

### Use the same message resolver and locale fallbacker as `vue-i18n`

In `petite-vue-i18n`, the message resolver and locale fallbacker use simple implementations to optimize code size, as described in the [differences section](https://github.com/intlify/vue-i18n/tree/master/packages/petite-vue-i18n#question-what-is-the-difference-from-vue-i18n-), as the belows:

- message resolver
  - Resolves key-value style locale messages
  - About implementation, see the [here](https://github.com/intlify/vue-i18n/blob/2d4d2a342f8bae134665a0b7cd945fb8b638839a/packages/core-base/src/resolver.ts#L305-L307)
- locale fallbacker
  - Fallback according to the array order specified in `fallbackLocale`
  - If a simple string locale is specified, fallback to that locale
  - About implementation, see the [here](https://github.com/intlify/vue-i18n/blob/2d4d2a342f8bae134665a0b7cd945fb8b638839a/packages/core-base/src/fallbacker.ts#L40-L58)

If you want to use the same message resolver and locale fallbacker as `vue-i18n`, you can change them using the API.

Note that at this time, only bundlers like vite and webpack are supported.

You need to install `@intlify/core-base` to your project with package manager.

::: code-group

```sh [npm]
npm install --save @intlify/core-base@next
```

```sh [yarn]
yarn add @intlify/core-base@next
```

```sh [pnpm]
pnpm add @intlify/core-base@next
```
:::

Then, at the entry point of the application, configure the message resolver and locale fallbacker using the API as the below:

```js
import { createApp } from 'vue'
import { createI18n } from 'petite-vue-i18n'
import {
  registerMessageResolver, // register the message resolver API
  resolveValue, // message resolver of vue-i18n which is used by default
  registerLocaleFallbacker, // register the locale fallbacker API
  fallbackWithLocaleChain // locale fallbacker of vue-i18n which is used by default
} from '@intlify/core-base'

// register message resolver of vue-i18n
registerMessageResolver(resolveValue)

// register locale fallbacker of vue-i18n
registerLocaleFallbacker(fallbackWithLocaleChain)

// some thing code ...
// ...
```

With the above settings, locale message resolving and locale fallbacking will be handled in the same way as in vue-i18n, note that the code size will increase slightly.

### Switch without changing import id

You can switch from vue-i18n to petite-vue-i18n in your application using npm alias without changing the import id.

package.json:
```diff
 {
   // ...
   "dependencies": {
     "vue": "^3.4.14",
-     "vue-i18n": "^10.0.0"
+     "vue-i18n": "npm:petite-vue-i18n@^10.0.0"
   },
 }
```

You need `@intlify/unplugin-vue-i18n` to build your application.

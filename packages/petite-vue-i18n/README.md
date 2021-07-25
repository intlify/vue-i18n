# petite-vue-i18n

Small size subset of Vue I18n

`petite-vue-i18n` is an alternative distribution of Vue I18n, which provides only minimal features.

## :question: What is defference from Vue I18n ?

- The Size is smaller than vue-i18n
  - For CDN or without a Bundler
    - The code size can be reduced by up to about 50%
    - `petite-vue-i18n`: runtime + compiler `~7.48KB`, runtime only `~4.07KB` (production build, brotli compression)
    - `vue-i18n`: runtime + compiler `~11.71KB`, runtime only `~8.30KB` (production build, brotli compression)
  - ES Modules for browser
    - runtime + compiler 35%, runtime only 49%
    - `petite-vue-i18n`: runtime + compiler `~7.51KB`, runtime only `~4.09KB` (production build, brotli compression)
    - `vue-i18n`: runtime + compiler `~11.73KB`, runtime only `~8.34KB` (production build, brotli compression)
- The legacy API is not supported, **only the composition API**
- The APIs for the following DateTime Foramts, Number Formats, and utilities aren’t included. **Translation only**
  - `n`, `$n`
  - `d`, `$d`
  - `rt`, `$rt`
  - `tm`, `$tm`
  - `getDateTimeFormat`, `setDateTimeFormat`, `mergeDateTimeFormat`
  - `getNumberFormat`, `setNumberFormat`, `mergeNumberFormat`
- **The only locale msssages that can be handled are simple key-values**. if you can handle hierarchical locale messages, you need to customize them using the API
- The algorithm of local fallback is **the array order** specified in `fallbackLocale`
- Custom directive `v-t` isn’t included
- The following components provided by `vue-i18n` aren’t included
  - Translation `i18n-t`
  - DatetimeFormat `i18n-d`
  - NumberFormat `i18n-n`

## :hammer: The use case of `petite-vue-i18n`

`vue-i18n` includes various i18n features such as translation, datetimes format and number formats. Some projects may only use translation and not datetime formats.  At the moment, even in that case, the code for that feature is included.

If your project only uses `t` or `$t` API for translation, so we recommended you would use `petite-vue-i18n` better than `vue-i18n`. And your project needs the features of `vue-i18n`, you can smoothly migrate from `petitle-vue-i18n` to `vue-i18n`. This means that it’s progressive enhancement.

## :warning: About the supporting of `petite-vue-i18n`

Note that `petitle-vue-i18n` is still experimental, and you may encounter bugs and unsupported use cases. Proceed at your own risk.

However, please don’t worry about it. Depending on the usage of `petitle-vue-i18n` and the feedback, we would like to use it refer to the development of the next version of `vue-i18n`. This means we will to maintain it.

We welcome your feedback on `petite-vue-i18n`.

## :cd: Installation

Basically, it’s the same as installing `vue-i18n`. The only difference is that the part of URL or part of path are changed from `vue-i18n` to `petite-vue-i18n`.

### CDN
You need to insert the following scripts to end of `<head>`:

```html
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/petite-vue-i18n"></script>
```

The following is the application code with script tag:

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

NPM:
```sh
npm install petite-vue-i18n
```

Yarn:
```sh
yarn add petite-vue-i18n
```

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

## :rocket: Usage

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
// import { createI18n } from 'petitle-vue-i18n'

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

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)

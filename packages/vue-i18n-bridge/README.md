# 🌉 vue-i18n-bridge

A bridge for Vue I18n Legacy

## ❓ What is `vue-i18n-bridge`?

`vue-i18n-bridge` is a bridge to make the upgrade as easy as possible between vue-i18n@v8.26.1 or later and vue-i18n@v9.x.

It can be used in Vue 2 applications that you have already built with vue-i18n@v8.26.1 or later.

And, also some features are backported from vue-i18n@v9.x:

- Vue I18n Compostion API, that is powered by `@vue/composition-api`
- Message format syntax, that is powered by `@intlify/message-compiler`

## 💿 Installation

### Package manager

```sh
# npm
npm install vue-i18n-bridge
# yarn
yarn add vue-i18n-bridge
# pnpm
pnpm add vue-i18n-bridge
```

You must install the below packages before using this library:

- vue-i18n: >= v8.26.1 < v9
- @vue/composition-api: >= v1.2.0

### CDN

Include `vue-i18n-bridge` after `vue`, `@vue/composition-api` and it will install.

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6"></script>
<script src="https://unpkg.com/vue-i18n@8/dist/vue-i18n.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@vue/composition-api@1.2"></script>
<script src="https://unpkg.com/vue-i18n-bridge@9.2.0-beta.30/dist/vue-i18n-bridge.global.prod.js"></script>
```

## 🚀 Usage

### Composition API

```js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueCompositionAPI, { createApp } from '@vue/composition-api'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true }) // you must specify '{ bridge: true }' plugin option when install vue-i18n

// `createI18n` options is almost same vue-i18n-next (vue-i18n@v9.x) API
const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `createI18n` which is provide `vue-i18n-bridge` has second argument, you **must** pass `VueI18n` constructor which is provide `vue-i18n`

const app = createApp({
 setup() {
   // `useI18n` options is almost same vue-i18n-next (vue-i18n@v9.x) API
   const { t, locale } = useI18n()
   // ... todo something

   return { t, locale }
 }
})

app.use(i18n) // you must install `i18n` instance which is created by `createI18n`
app.mount('#app')
```

### Legacy API

```js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueCompositionAPI from '@vue/composition-api'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true }) // you must specify '{ bridge: true }' plugin option when install vue-i18n

// `createI18n` options is almost same vue-i18n-next (vue-i18n@v9.x) API
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `createI18n` which is provide `vue-i18n-bridge` has second argument, you **must** pass `VueI18n` constructor which is provide `vue-i18n`

Vue.use(i18n) // you must install `i18n` instance which is created by `createI18n`

const app = new Vue({ i18n })
app.$mount('#app')
```

For TypeScript:
```ts
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueCompositionAPI from '@vue/composition-api'
import { createI18n, useI18n, castToVueI18n } from 'vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true })

const i18n = castToVueI18n(
  createI18n(
    {
      locale: 'ja',
      messages: {
        en: {
          message: {
            hello: 'hello, {name}!',
          },
        },
        ja: {
          message: {
            hello: 'こんにちは、{name}！',
          },
        },
      },
    },
    VueI18n
  )
)

Vue.use(i18n)

const app = new Vue({ i18n }) // you need to cast `i18n` instance
app.$mount('#app')
```

### Usage UMD module in browser

```js
const { createApp } = VueCompositionAPI // exported UMD which is named by `VueCompositionAPI
const { createI18n, useI18n } = VueI18nBridge // exported UMD which is named by `VueI18nBridge`

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true })
```

## ⚠️ Limitations
- In Legacy API mode, You **cannot use [new message format syntax](https://vue-i18n.intlify.dev/guide/essentials/syntax.html)** by porting from `vue-i18n-next`
  - it use possible only Composition API mode
- In Composition API mode, If you can use the following components, these can be referenced i18n resources, **only globally**
  - i18n functional component `<i18n>`
  - i18n-n functional component `<i18n-n>`

## Explanation of Different Builds
In the [dist/ directory of the npm package](https://unpkg.com/browse/vue-i18n-bridge@9.2.0-beta.6/dist/) you will find many different builds of `vue-i18n-bridge`. Here is an overview of which dist file should be used depending on the use-case.

### From CDN or without a Bundler

- **`vue-i18n-bridge(.runtime).global(.prod).js`**:
  - For direct use via `<script src="...">` in the browser. Exposes the `VueI18nBridge` global
  - In-browser message format compilation:
    - `vue-i18n-bridge.global.js` is the "full" build that includes both the compiler and the runtime so it supports compiling message formats on the fly
    - `vue-i18n-bridge.runtime.global.js` contains only the runtime and requires message formats to be pre-compiled during a build step
  - Inlines all Vue I18n core internal packages - i.e. it’s a single file with no dependencies on other files. This means you **must** import everything from this file and this file only to ensure you are getting the same instance of code
  - Contains hard-coded prod/dev branches, and the prod build is pre-minified. Use the `*.prod.js` files for production

> ⚠️ NOTE:
Global builds are not [UMD](https://github.com/umdjs/umd) builds. They are built as [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and are only meant for direct use via `<script src="...">`.

- **`vue-i18n-bridge(.runtime).esm-browser(.prod).js`**:
  - For usage via native ES modules imports (in browser via `<script type="module">`)
  - Shares the same runtime compilation, dependency inlining and hard-coded prod/dev behavior with the global build

### With a Bundler

- **`vue-i18n-bridge(.runtime).esm-bundler.js`**:
  - For use with bundlers like `webpack`, `rollup` and `parcel`
  - Leaves prod/dev branches with `process.env.NODE_ENV` guards (must be replaced by bundler)
  - Does not ship minified builds (to be done together with the rest of the code after bundling)
  - Imports dependencies (e.g. `@intlify/core-base`, `@intlify/message-compiler`)
    - Imported dependencies are also `esm-bundler` builds and will in turn import their dependencies (e.g. `@intlify/message-compiler` imports `@intlify/shared`)
    - This means you **can** install/import these deps individually without ending up with different instances of these dependencies, but you must make sure they all resolve to the same version
  - In-browser locale messages compilation:
    - **`vue-i18n-bridge.runtime.esm-bundler.js`** is runtime only, and requires all locale messages to be pre-compiled. This is the default entry for bundlers (via `module` field in `package.json`) because when using a bundler templates are typically pre-compiled (e.g. in `*.json` files)
    - **`vue-i18n-bridge.esm-bundler.js` (default)**: includes the runtime compiler. Use this if you are using a bundler but still want locale messages compilation (e.g. templates via inline JavaScript strings).  To use this build, change your import statement to: `import { createI18n } from "vue-i18n-bridge/dist/vue-i18n-bridge.esm-bundler.js";`

> ⚠️ NOTE:
If you use `vue-i18n-bridge.runtime.esm-bundler.js`, you will need to precompile all locale messages, and you can do that with `.json` (`.json5`) or `.yaml`, i18n custom blocks to manage i18n resources. Therefore, you can be going to pre-compile all locale messages with bundler and the following loader / plugin.

- [`@intlify/vite-plugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n)
- [`@intlify/vue-i18n-loader`](https://github.com/intlify/bundle-tools/tree/main/packages/vue-i18n-loader)
- [`@intlify/rollup-plugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/rollup-plugin-vue-i18n)
:::

### For Node.js (Server-Side)

- **`vue-i18n-bridge.cjs(.prod).js`**:
  - For use in Node.js via `require()`
  - If you bundle your app with webpack with `target: 'node'` and properly externalize `vue-i18n-bridge`, this is the build that will be loaded
  - The dev/prod files are pre-built, but the appropriate file is automatically required based on `process.env.NODE_ENV`

## ©️ License

[MIT](http://opensource.org/licenses/MIT)

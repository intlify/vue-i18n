# Installation


## Compatibility Note

- Vue.js `3.0.0`+


## Direct Download

<https://unpkg.com/vue-i18n@next>

[unpkg.com](https://unpkg.com) provides aw npm-based CDN links. The above link will always point to the latest release on npm.

### Global import

```html
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/vue-i18n@next"></script>
```

You can also use a specific version/tag via URLs like <https://unpkg.com/vue-i18n@9.0.0-beta.8/dist/vue-i18n.global.js>

### ES Modules import

```html
<script type="module" src="https://unpkg.com/vue@next/dist/vue.esm-browser.js">
<script type="module" src="https://unpkg.com/vue-i18n@next/dist/vue-i18n.esm-browser.js">
```

You can also use a specific version/tag via URLs like <https://unpkg.com/vue-i18n@9.0.0-beta.8/dist/vue-i18n.esm-browser.js>


## Package managers

### NPM

```sh
npm install vue-i18n@next
```

### Yarn

```sh
yarn add vue-i18n@next
```

When using with a module system, you must explicitly install the `vue-i18n`
via `app.use()`:


```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // shomething vue-i18n options here ...
})

const app = createApp({
  // something vue options here ...
})

app.use(i18n)
app.mount('#app')
```


## Dev Build

You will have to clone directly from GitHub and build `vue-i18n` yourself if you want to use the latest dev build.

```sh
git clone git@github.com:intlify/vue-i18n-next.git node_modules/vue-i18n
cd node_modules/vue-i18n
npm install # or `yarn`
npm run build  # or `yarn run build`
```


## Explanation of Different Builds
In the [dist/ directory of the npm package](https://cdn.jsdelivr.net/npm/vue-i18n@9.0.0-beta.8/dist/) you will find many different builds of Vue I18n. Here is an overview of which dist file should be used depending on the use-case.

### From CDN or without a Bundler

- **`vue-i18n.global(.prod).js`**:
  - For direct use via `<script src="...">` in the browser. Exposes the `VueI18n` global.
  - Note that global builds are not [UMD](https://github.com/umdjs/umd) builds.  They are built as [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and are only meant for direct use via `<script src="...">`.
  - Contains hard-coded prod/dev branches, and the prod build is pre-minified. Use the `*.prod.js` files for production.

:::tip NOTE
Global builds are not [UMD](https://github.com/umdjs/umd) builds. They are built as [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and are only meant for direct use via `<script src="...">`.
:::

- **`vue-i18n.esm-browser(.prod).js`**:
  - For usage via native ES modules imports (in browser via `<script type="module">`.
  - Shares the same runtime compilation, dependency inlining and hard-coded prod/dev behavior with the global build.

### With a Bundler

- **`vue-i18n.esm-bundler.js`**:
  - For use with bundlers like `webpack`, `rollup` and `parcel`.
  - Leaves prod/dev branches with `process.env.NODE_ENV` guards (must be replaced by bundler)
  - Does not ship minified builds (to be done together with the rest of the code after bundling)

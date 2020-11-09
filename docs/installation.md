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

You can also use a specific version/tag via URLs like <https://unpkg.com/vue-i18n@9.0.0-beta.6/dist/vue-i18n.global.js>

### ES Modules import

```html
<script type="module" src="https://unpkg.com/vue@next/dist/vue.esm-browser.js">
<script type="module" src="https://unpkg.com/vue-i18n@next/dist/vue-i18n.esm-browser.js">
```

You can also use a specific version/tag via URLs like <https://unpkg.com/vue-i18n@9.0.0-beta.6/dist/vue-i18n.esm-browser.js>


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

const app = createApp({
  // something vue options here ...
})

const i18n = createI18n({
  // shomething vue-i18n options here ...
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

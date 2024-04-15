# Installation


## Compatibility Note

- Vue.js `3.0.0`+

## Package managers

::: code-group

```sh [npm]
npm install vue-i18n@9
```

```sh [yarn]
yarn add vue-i18n@9
```

```sh [pnpm]
pnpm add vue-i18n@9
```

:::

When using with a module system, you must explicitly install the `vue-i18n`
via `app.use()`:


```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // something vue-i18n options here ...
})

const app = createApp({
  // something vue options here ...
})

app.use(i18n)
app.mount('#app')
```


## Direct Download

<https://unpkg.com/vue-i18n@9>

[unpkg.com](https://unpkg.com) provides a npm-based CDN links. The above link will always point to the latest release on npm.

### Global import

```html
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-i18n@9"></script>
```

You can also use a specific version/tag via URLs like <https://unpkg.com/vue-i18n@9.12.0/dist/vue-i18n.global.js>

### ES Modules import

```html
<script type="module" src="https://unpkg.com/vue@3/dist/vue.esm-browser.js">
<script type="module" src="https://unpkg.com/vue-i18n@9/dist/vue-i18n.esm-browser.js">
```

You can also use a specific version/tag via URLs like <https://unpkg.com/vue-i18n@9.12.0/dist/vue-i18n.esm-browser.js>


## Edge version

Add the following line to the `dependencies` in `package.json`:

```json
"vue-i18n": "npm:@vue-i18n-edge"
```

And then run `npm install` or `yarn install` or `pnpm install`.

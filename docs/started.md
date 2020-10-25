# Getting started

:::tip NOTE
We will be using [ES2015](https://github.com/lukehoban/es6features) in the
code samples in the guide.

Also, all examples will be using the full version of Vue to make on-the-fly template compilation possible. See more details [here](https://v3.vuejs.org/guide/installation.html#runtime-compiler-vs-runtime-only).
:::

## HTML

```html
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/vue-i18n@next"></script>

<div id="app">
  <p>{{ $t("message.hello") }}</p>
</div>
```

## JavaScript

```js
// Ready translated locale messages
const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  },
  ja: {
    message: {
      hello: 'こんにちは、世界'
    }
  }
}

// Create i18n instance with options
const i18n = VueI18n.createI18n({
  locale: 'ja', // set locale
  messages, // set locale messages
})


// Create a root instance
const app = Vue.createApp({})

// Install i18n
app.use(i18n)

// Mount
app.mount('#app')
```

Output the following:

```html
<div id="#app">
  <p>こんにちは、世界</p>
</div>
```

# Getting started

:::tip NOTE
We will be using [ES6](https://github.com/lukehoban/es6features) in the code samples in the guide.

Also, all examples will be using the full version of Vue to make on-the-fly template compilation possible. See more details [here](https://v3.vuejs.org/guide/installation.html#runtime-compiler-vs-runtime-only).
:::

Creating a global application with Vue + Vue I18n is dead simple. With Vue.js, we are already composing our application with components. When adding Vue I18n to the mix, all we need to ready resource messages and simply use the localization API and they offered with Vue I18n.

Here’s a basic example:

## HTML

```html
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/vue-i18n@next"></script>

<div id="app">
  <p>{{ $t("message.hello") }}</p>
</div>
```

In the HTML template, we use the `$t` translation API injected with Vue I18n, to localize. This allows Vue I18n to change the locale without rewriting the template, be able to support the global application.

## JavaScript

```js
// 1. Ready translated locale messages
// The structure of the locale message is the hierarchical object structure with each locale as the top property
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

// 2. Create i18n instance with options
const i18n = VueI18n.createI18n({
  locale: 'ja', // set locale
  fallbackLocale: 'en' // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})


// 3. Create a vue root instance
const app = Vue.createApp({
  // set something options
  // ...
})

// 4. Install i18n instance to make the whole app i18n-aware
app.use(i18n)

// 5. Mount
app.mount('#app')

// Now the app has started!
```

Output the following:

```html
<div id="app">
  <p>こんにちは、世界</p>
</div>
```

By calling `app.use(i18n)`, By default, we can access the VueI18n instance from each component with `this.$i18n`, which can be referenced from the `global` property of i18n instance that created with `createI18n`. As well as, translation API such as `this.$t` is also injected into each component, so these API can be used with templates.

To use similar ways at the `setup` function, you need to call the `useI18n` functions. We will learn more about this in the [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)

Throughout the docs, we’ll use APIs like `this.$i18n` and `this.$t`, which are almost keep backward compatible from Vue I18n v8.x.

:::tip NOTE
In Vue I18n v9 and later, the API offered by Vue I18n v8.x is called **Legacy API**.
:::

The following sections will be explained using the Legacy API.

## Have you already used Vue I18n ?

If you`ve used Vue I18n before, you’ll want to use the API offered for Compostion API to support i18n, but some new features are supported in Vue I18n v9 and later.

So recommended that you read through the basics at least once.

If you just wanna use the Compositoin API and just wanna migrate from Vue 2.x, you can read on from the sections below:

- Advanced
  - [Compostion API](../advanced/composition)
- Migration from Vue 2
  - [Breaking Changes](../migration/breaking)
  - [New Features](../migration/features)

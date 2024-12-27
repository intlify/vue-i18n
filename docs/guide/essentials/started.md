# Getting started

Creating a global application with Vue + Vue I18n is dead simple. With Vue.js, we are already composing our application with components. When adding Vue I18n to the mix, all we need to do is ready resource messages and simply use the localization API that are offered with Vue I18n.

:::tip NOTE
This guide will assume that you are already familiar with Vue itself. You don't need to be a Vue expert, but you may occasionally need to refer back to the [core Vue documentation](https://vuejs.org/) for more information about certain features.
:::

## An example

we're going to consider this example:

- [StackBlitz example](https://stackblitz.com/edit/vue-i18n-get-started?file=main.js)

Let's start by looking at the root component, `App.vue`.

### App.vue

```vue
<template>
  <h1>{{ $t('message.hello') }}</h1>
</template>
```

In the template, we use the `$t` translation API injected with Vue I18n, to localize. This allows Vue I18n to change the locale without rewriting the template, also to be able to support the globally application.

You will have the following output:

```vue
<h1>こんにちは、世界</h1>
```

Let's take a look at how this is achieved in JavaScript!

### Creating the i18n instance

The i18n instance is created by calling the function `createI18n`.

```js
const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'en',
  messages: {
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
})
```

We can specify some options to `createI18n`.
The important options are the `locale`, `fallbackLocale`, and `messages` options.

`locale` is the language of the Vue application to be localized.

`fallbackLocale` is the language to fall back to if the key resource specified in the `$t` translation API is not found in the language of `locale`.

`messages` is the locale messages to translate with the `$t` translation API. The structure of the locale message is the hierarchical object structure with each locale as the top property

### Registering the i18n plugin

Once we've created our i18n instance, we need to register it as a plugin by calling `use` on our application:

```js
const app = createApp(Vue)
app.use(i18n)
app.mount('#app')
```

Like with most Vue plugins, the call to `use` needs to happen before the call to `mount`.

If you're curious about what this plugin does, some of its responsibilities include:

1. Adding the global properties and methods such as `$t`, `$i18n`
2. Enabling the `useI18n` composables
3. [Globally registering](https://vuejs.org/guide/components/registration.html#global-registration) the `i18n-t`, `i18n-d`, and `i18n-n` components.

## Conventions in this guide

### Single-File Components

Vue I18n is most commonly used in applications built using a bundler (e.g. Vite) and [SFCs](https://vuejs.org/guide/introduction.html#single-file-components) (i.e. `.vue ` files). Most of the examples in this guide will be written in that style, but Vue I18n itself doesn't require you to use build tools or SFCs.

For example, if you're using the _global builds_ of [Vue](https://vuejs.org/guide/quick-start.html#using-vue-from-cdn) and [Vue I18n](../installation#Direct-Download-CDN), the libraries are exposed via global objects, rather than imports:

```js
const { createApp } = Vue
const { createI18n, useI18n } = VueI18n
```

### Component API style

Vue I18n can be used with both the Composition API and the Options API. Where relevant, the examples in this guide will show components written in both styles. Composition API examples will typically use `<script setup>`, rather than an explicit `setup` function.

If you need a refresher about the two styles, see [Vue - API Styles](https://vuejs.org/guide/introduction.html#api-styles).

Vue I18n works with both Vue composition API and Options API. Vue I18n has two APIs style like Vue, Composition API and Legacy API for options API using.

:::danger IMPORTANT
In Vue I18n v9 and later, the API offered by Vue I18n v8.x is called **Legacy API** mode.
Legacy API is deprecated Vue I18n v11, and drop Vue I18n v12. We recommend use Composition API mode.
:::

The following sections will be explained using the Legacy API.

If you would like to use it in Composition API style and already understand Vue I18n, you can step to [here](../advanced/composition).

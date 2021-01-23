# Scope and Locale Changing

## Scope

Vue I18n manages resources to offer i18n features, including locale switching, each language messages called locales messages, and named format for datetime and numbers. They are managed with the `VueI18n` instance.

The Vue application is built from some components on the tree structure. To localize each of components in Vue I18n using the i18n features, we need to understand the concept of scope.

Vue I18n has two scopes the below:

- global scope
- local scope

![scope](/scope.png)

### Global Scope

The global scope allows you to refer to scopes in all components of the Vue application. The global scope is very useful if you want to centrally manage i18n resources across your application.

The global scope is created when you create an i18n instance with `createI18n`, and the one to be scoped is the one for the `VueI18n` instance, which can be accessed by the i18n instance `global` property. What is global scoped is the one of the `VueI18n` instance that is accessible with `global` property of the i18n instance.

The global scope is enabled on the target component when the `i18n` component option is unspecified. When global scope is enabled on a component, `VueI18n` instance accessed by `this.$i18n` is essentially the same as i18n instance `global` property.


### Local Scope

The local scope allows you to apply scopes on each component basis like the `<style scoped>` of single-file components, only that component’s scope is enabled. This is very useful if you want to manage the i18n resource like locale messages for each component.

The local scope is enabled with specifying the `i18n` component option, which creates a `VueI18n` instance when the component is initialized. So, `VueI18n` instance of the component `this.$i18n` is not the same as `VueI18n` instance referenced with `global` property of the i18n instance.

## Locale Changing

So far, we’ve explained the concept of the scope, and once you understand the scope, it’s easy to understand how to change the locale.

### Global Scope

If you want to change the locale for the whole application, global scope allows you to use the `$i18n.locale` for each component.

Here’s an example:

```js
const i18n = createI18n({
  locale: 'ja', // set current locale
  messages: {
    en: {
      hello: 'hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  },
  // vue-i18n something options here ...
  // ...
})

// create Vue app instance, install Vue I18n, and mount!
createApp({
  // something vue options here ...
  // ...
}).use(i18n).mount('#app')
```

Component:

```html
<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
    </select>
  </div>
</template>
```

The above example uses the `availableLocales` property of `VueI18n` instance to list the available locales as options for the select element. Since `$i18n.locale` is bound with `v-model`, you can switch it by selecting the option of the select element, which sets its value to `$i18n.locale`.

As you can see, the global scope is very useful because it allows you to switch the messages displayed in the UI for all components of the application at once.

### Local Scope

`locale` of local scope is inherited from global Scope by default. Therefore, when you change the `locale` in global scope, the `locale` in local scope is also changed.

If you want to switch the locale for the whole application, you need to change it via `global` property of i18n instance created with `createI18n`.

:::tip NOTE
If you don’t want to inherit `locale` from global scope, you need to set `sync` of `i18n` component option to `false`.
:::

Example:

```js
const i18n = createI18n({
  locale: 'ja', // set current locale
  // vue-i18n something options here ...
  // ...
})

// create Vue app instance, install Vue I18n, and mount!
createApp({
  // something vue options here ...
  // ...
}).use(i18n).mount('#app')


// change locale via `global` property
i18n.global.locale = 'en'
```

:::warning NOTICE
Changing `locale` of local scope does not affect `locale` of global scope. This means that changing the locale in `$i18n.locale` in local scope component will not change the entire application’s locale, only that component. Use `$root.$i18n.locale` instead of `$i18n.locale`.
:::

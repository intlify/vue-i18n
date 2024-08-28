# Scope and Locale Changing

## Scope

Vue I18n manages resources to offer i18n features, including locale switching, each language messages called locales messages, and named format for datetime and numbers. They are managed with the `VueI18n` instance.

The Vue application is built from some components on the tree structure. To localize each of components in Vue I18n using the i18n features, we need to understand the concept of scope.

Vue I18n has two scopes the below:

- global scope
- local scope

![scope](/scope.png)

### Global Scope

The global scope in Vue allows you to access and manage internationalization (i18n) resources across all components in your application. This is especially useful for centralizing i18n management.

When you create an i18n instance using createI18n, a global scope is automatically created. This global scope is tied to the VueI18n instance, which can be accessed through the global property of the i18n instance. Essentially, the global scope refers to the VueI18n instance that is accessible via the i18n instance’s global property.

If the i18n option is not specified in a component, the global scope is automatically enabled for that component. In this case, the VueI18n instance accessed through this.$i18n within the component is the same as the global instance available via the i18n instance’s global property.


### Local Scope

The local scope in Vue allows you to manage i18n resources on a per-component basis, similar to how <style scoped> works in single-file components. When a component has a local scope, only that component's i18n resources are active. This is particularly useful when you want to manage locale messages specific to each component.

Local scope is enabled by specifying the i18n option within the component. This creates a new VueI18n instance when the component is initialized. As a result, the VueI18n instance accessed through this.$i18n in that component is distinct from the global VueI18n instance available through the global property of the i18n instance.

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

```vue
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

// when vue-i18n is being used with legacy: false, note that i18n.global.locale is a ref, so we must set it via .value:
i18n.global.locale.value = 'en'

// otherwise - when using legacy: true, we set it like this:
i18n.global.locale = 'en'
```

:::warning NOTICE
Changing `locale` of local scope does not affect `locale` of global scope. This means that changing the locale in `$i18n.locale` in local scope component will not change the entire application’s locale, only that component. Use `$root.$i18n.locale` instead of `$i18n.locale`.
:::

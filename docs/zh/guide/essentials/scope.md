# 作用域和区域设置更改

## 作用域

Vue I18n 管理资源以提供国际化功能，包括区域设置切换、每种语言的消息（称为区域设置消息）以及日期时间和数字的命名格式。它们由 Composer 实例管理。

Vue 应用程序是由树状结构的组件构建的。为了使用国际化功能在 Vue I18n 中本地化每个组件，我们需要理解作用域的概念。

Vue I18n 有以下两个作用域：

- 全局作用域
- 本地作用域

![scope](/scope.png)

### 全局作用域

Vue 中的全局作用域允许你访问和管理应用程序中所有组件的国际化 (i18n) 资源。这对于集中管理 i18n 特别有用。

当你使用 `createI18n` 创建 i18n 实例时，会自动创建一个全局作用域。此全局作用域绑定到 Composer 实例，可以通过 i18n 实例的 `global` 属性访问。

如果没有通过 `useI18n()` 指定本地消息，则使用全局作用域。当没有提供本地消息时，`useI18n()` 返回的 Composer 实例引用的是全局 Composer。

### 本地作用域

Vue 中的本地作用域允许你在每个组件的基础上管理 i18n 资源，类似于单文件组件中 `<style scoped>` 的工作方式。当组件具有本地作用域时，只有该组件的 i18n 资源处于活动状态。当你想要管理特定于每个组件的区域设置消息时，这特别有用。

通过在 `useI18n()` 中指定消息或在 SFC 中使用 `<i18n>` 自定义块来启用本地作用域。这会在组件初始化时创建一个新的 Composer 实例。因此，该组件中 `useI18n()` 返回的 Composer 实例与全局 Composer 实例是不同的。

## 区域设置更改

到目前为止，我们已经解释了作用域的概念，一旦你理解了作用域，就很容易理解如何更改区域设置。

### 全局作用域

如果你想更改整个应用程序的区域设置，可以使用 `useI18n()` 来访问全局区域设置。

这是一个例子：

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
createApp(App).use(i18n).mount('#app')
```

组件：

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()
</script>

<template>
  <div class="locale-changer">
    <select v-model="locale">
      <option
        v-for="loc in availableLocales"
        :key="`locale-${loc}`"
        :value="loc"
      >
        {{ loc }}
      </option>
    </select>
  </div>
</template>
```

:::tip NOTE
在模板中，也可以通过全局注入使用 `$i18n.locale`。它提供对 `locale`、`fallbackLocale` 和 `availableLocales` 的访问。有关 `$i18n` 属性的详情，请参阅 [v12 破坏性变更](../migration/breaking12#drop-legacy-api-mode)。
:::

上面的示例使用 `useI18n()` 的 `availableLocales` 列出可用的区域设置作为 select 元素的选项。由于 `locale` 是一个可写的 computed ref，你可以通过选择选项来切换它。

如你所见，全局作用域非常有用，因为它允许你一次性切换应用程序所有组件在 UI 中显示的消息。

### 本地作用域

本地作用域的 `locale` 默认继承自全局作用域。因此，当你更改全局作用域中的 `locale` 时，本地作用域中的 `locale` 也会随之更改。

如果你想切换整个应用程序的区域设置，你需要通过使用 `createI18n` 创建的 i18n 实例的 `global` 属性来更改它。

:::tip NOTE
如果你不想从全局作用域继承 `locale`，你需要在 `useI18n()` 的选项中设置 `inheritLocale: false`。
:::

示例：

```js
const i18n = createI18n({
  locale: 'ja', // set current locale
  // vue-i18n something options here ...
  // ...
})

// create Vue app instance, install Vue I18n, and mount!
createApp(App).use(i18n).mount('#app')

// change locale via `global` property
// i18n.global.locale is a ref, so set it via .value:
i18n.global.locale.value = 'en'
```

:::warning NOTICE
更改本地作用域的 `locale` 不会影响全局作用域的 `locale`。这意味着在本地作用域组件中更改区域设置不会更改整个应用程序的区域设置。使用 `useI18n({ useScope: 'global' })` 或访问 `i18n.global.locale.value` 来更改全局区域设置。
:::

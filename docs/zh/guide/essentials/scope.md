# 作用域和区域设置更改

## 作用域 (Scope)

Vue I18n 管理资源以提供国际化功能，包括区域设置切换、每种语言的消息（称为语言环境消息）以及日期时间和数字的命名格式。它们由 `VueI18n` 实例管理。

Vue 应用程序是由树状结构的组件构建的。为了使用国际化功能在 Vue I18n 中本地化每个组件，我们需要理解作用域的概念。

Vue I18n 有以下两个作用域：

- 全局作用域 (global scope)
- 本地作用域 (local scope)

![scope](/scope.png)

### 全局作用域

Vue 中的全局作用域允许你访问和管理应用程序中所有组件的国际化 (i18n) 资源。这对于集中管理 i18n 特别有用。

当你使用 `createI18n` 创建 i18n 实例时，会自动创建一个全局作用域。此全局作用域绑定到 `VueI18n` 实例，可以通过 i18n 实例的 `global` 属性访问。本质上，全局作用域指的是可以通过 i18n 实例的 `global` 属性访问的 `VueI18n` 实例。

如果在组件中未指定 `i18n` 选项，则该组件会自动启用全局作用域。在这种情况下，组件内通过 `this.$i18n` 访问的 `VueI18n` 实例与通过 i18n 实例的 `global` 属性访问的全局实例相同。

### 本地作用域

Vue 中的本地作用域允许你在每个组件的基础上管理 i18n 资源，类似于单文件组件中 `<style scoped>` 的工作方式。当组件具有本地作用域时，只有该组件的 i18n 资源处于活动状态。当你想要管理特定于每个组件的语言环境消息时，这特别有用。

通过在组件内指定 `i18n` 选项来启用本地作用域。这会在组件初始化时创建一个新的 `VueI18n` 实例。因此，在该组件中通过 `this.$i18n` 访问的 `VueI18n` 实例与通过 i18n 实例的 `global` 属性访问的全局 `VueI18n` 实例是不同的。

## 区域设置更改 (Locale Changing)

到目前为止，我们已经解释了作用域的概念，一旦你理解了作用域，就很容易理解如何更改区域设置。

### 全局作用域

如果你想更改整个应用程序的区域设置，全局作用域允许你为每个组件使用 `$i18n.locale`。

这是一个例子：

```js
const i18n = createI18n({
  locale: 'ja', // 设置当前区域设置
  messages: {
    en: {
      hello: 'hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  },
  // vue-i18n 一些选项 ...
  // ...
})

// 创建 Vue 应用实例，安装 Vue I18n，并挂载！
createApp({
  // 一些 vue 选项 ...
  // ...
}).use(i18n).mount('#app')
```

组件：

```vue
<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale">
      <option
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
      >
        {{ locale }}
      </option>
    </select>
  </div>
</template>
```

上面的示例使用 `VueI18n` 实例的 `availableLocales` 属性列出可用的区域设置作为 select 元素的选项。由于 `$i18n.locale` 与 `v-model` 绑定，你可以通过选择 select 元素的选项来切换它，这会将其值设置为 `$i18n.locale`。

如你所见，全局作用域非常有用，因为它允许你一次性切换应用程序所有组件在 UI 中显示的消息。

### 本地作用域

本地作用域的 `locale` 默认继承自全局作用域。因此，当你更改全局作用域中的 `locale` 时，本地作用域中的 `locale` 也会随之更改。

如果你想切换整个应用程序的区域设置，你需要通过使用 `createI18n` 创建的 i18n 实例的 `global` 属性来更改它。

:::tip 注意
如果你不想从全局作用域继承 `locale`，你需要将 `i18n` 组件选项的 `sync` 设置为 `false`。
:::

示例：

```js
const i18n = createI18n({
  locale: 'ja', // 设置当前区域设置
  // vue-i18n 一些选项 ...
  // ...
})

// 创建 Vue 应用实例，安装 Vue I18n，并挂载！
createApp({
  // 一些 vue 选项 ...
  // ...
}).use(i18n).mount('#app')


// 通过 `global` 属性更改区域设置

// 当 vue-i18n 与 legacy: false 一起使用时，请注意 i18n.global.locale 是一个 ref，所以我们必须通过 .value 设置它：
i18n.global.locale.value = 'en'

// 否则 - 当使用 legacy: true 时，我们这样设置它：
i18n.global.locale = 'en'
```

:::warning 注意
更改本地作用域的 `locale` 不会影响全局作用域的 `locale`。这意味着在本地作用域组件中更改 `$i18n.locale` 中的区域设置不会更改整个应用程序的区域设置，只会更改该组件的区域设置。请使用 `$root.$i18n.locale` 代替 `$i18n.locale`。
:::

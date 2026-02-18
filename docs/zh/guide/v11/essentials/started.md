:::warning v11 文档
这是 **Vue I18n v11** 的文档。如果您使用的是 v12 或更高版本，请参阅 [最新指南](/zh/guide/essentials/started)。
:::

# Getting started

使用 Vue + Vue I18n 创建国际化应用非常简单。Vue.js 本身就使用组件来构建应用。而添加 Vue I18n 后，我们只需准备好国际化的文案，然后使用 Vue I18n 提供的本地化 API 即可。

:::tip NOTE
本指南假设您已经熟悉 Vue 本身。您无需成为 Vue 专家，但有时可能需要参考 [Vue 官方文档](https://vuejs.org/) 以获取有关某些功能的更多信息。
:::

## 示例

我们来思考这个例子：

- [StackBlitz 示例](https://stackblitz.com/edit/vue-i18n-get-started-jtknregd?file=main.js)

先来看看根组件 `App.vue`。

### App.vue

```vue
<template>
  <h1>{{ $t('message.hello') }}</h1>
</template>
```

在模板中，我们使用由 Vue I18n 注入的 `$t` 翻译 API 来实现本地化。这样可以在不需要重写模板的情况下切换语言环境，同时也支持整个应用的全局国际化。

您将看到以下输出：

```vue
<h1>こんにちは、世界</h1>
```

让我们来看看如何在 JavaScript 中实现！

### 创建 i18n 实例

调用 `createI18n` 函数即可创建 i18n 实例。

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

我们可以为 `createI18n` 函数指定一些选项。
重要的选项有 `locale`、`fallbackLocale` 和 `messages`。

`locale` 是需要本地化的 Vue 应用的语言。

`fallbackLocale` 是当 `$t` 翻译 API 中指定的键资源在 `locale` 语言中找不到时要回退的语言。

`messages` 是要使用 `$t` 翻译 API 进行翻译的语言环境消息。语言环境消息的结构是一个层级对象结构，每个语言环境都位于顶层属性。

### 注册 i18n 插件

创建 i18n 实例后，我们需要通过在应用程序中调用 `use` 来将其注册为插件：

```js
const app = createApp(Vue)
app.use(i18n)
app.mount('#app')
```

与大多数 Vue 插件一样，`use` 调用必须在 `mount` 调用之前进行。

如果您想了解此插件的功能，它的部分职责包括：

1. 添加全局属性和方法，例如 `$t` 和 `$i18n`
2. 启用 `useI18n` 可组合组件
3. [全局注册](https://vuejs.org/guide/components/registration.html#global-registration) `i18n-t`、`i18n-d` 和 `i18n-n` 组件。

## 本指南中的约定

### 单文件组件

Vue I18n 最常用于使用打包工具（例如 Vite）和 [单文件组件](https://vuejs.org/guide/introduction.html#single-file-components)（即 `.vue` 文件）构建的应用程序中。本指南中的大多数示例都将采用这种风格编写，但 Vue I18n 本身并不对您使用的构建工具或 SFC 文件有强制要求。

例如，如果您使用的是 [Vue](https://vuejs.org/guide/quick-start.html#using-vue-from-cdn) 和 [Vue I18n](/zh/guide/installation#Direct-Download-CDN) 的全局构建版本，这些库会通过全局对象暴露，而不是通过模块导入的方式来使用：

```js
const { createApp } = Vue
const { createI18n, useI18n } = VueI18n
```

### 组件 API 风格

Vue I18n 可以与 Composition API 和 Options API 一起使用。本指南中的示例将在适当情况下展示使用这两种风格编写的组件。Composition API 示例通常会使用 `<script setup>`，而不是显式的 `setup` 函数。

如果您需要复习一下这两种风格，请参阅[Vue - API 风格](https://vuejs.org/guide/introduction.html#api-styles)。

Vue I18n 同时支持 Vue 的组合式 API 和选项式 API。Vue I18n 提供两种 API 风格：组合式 API 和用于选项式 API 的旧版 API。

:::danger 重要提示

在 Vue I18n v9 及更高版本中，Vue I18n v8.x 提供的 API 被称为**旧版 API** 模式。

旧式 API 在 Vue I18n v11 中已被弃用，并在 Vue I18n v12 中被移除。我们建议使用组合式 API 模式。

:::

以下章节将使用旧版 API 进行讲解。

如果您想使用组合式 API 风格，并且已经了解 Vue I18n，您可以跳转到[此处](../advanced/composition)。
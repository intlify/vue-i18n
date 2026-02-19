# 快速开始

使用 Vue + Vue I18n 创建国际化应用非常简单。Vue.js 本身就使用组件来构建应用。而添加 Vue I18n 后，我们只需准备好资源消息，然后使用 Vue I18n 提供的本地化 API 即可。

:::tip NOTE
本指南假设你已经熟悉 Vue 本身。你无需成为 Vue 专家，但有时可能需要参考 [Vue 官方文档](https://vuejs.org/) 以获取有关某些功能的更多信息。
:::

## 示例

我们来看这个例子：

- [StackBlitz 示例](https://stackblitz.com/edit/vue-i18n-get-started-jtknregd?file=main.js)

先来看看根组件 `App.vue`。

### App.vue

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1>{{ t('message.hello') }}</h1>
</template>
```

在模板中，我们使用从 `useI18n()` 获取的 `t` 函数来进行本地化。这样 Vue I18n 可以在不需要重写模板的情况下切换语言环境，同时也支持全局应用。

你将看到以下输出：

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

`fallbackLocale` 是当翻译 API（例如 `useI18n()` 的 `t`）中指定的键资源在 `locale` 语言中找不到时要回退的语言。

`messages` 是要使用翻译 API 进行翻译的区域设置消息。区域设置消息的结构是一个层级对象结构，每个区域设置作为顶层属性。

### 注册 i18n 插件

创建 i18n 实例后，我们需要通过在应用程序中调用 `use` 来将其注册为插件：

```js
const app = createApp(Vue)
app.use(i18n)
app.mount('#app')
```

与大多数 Vue 插件一样，`use` 调用必须在 `mount` 调用之前进行。

如果你想了解此插件的功能，它的部分职责包括：

1. 添加全局属性和方法，例如 `$t` 和 `$i18n`
2. 启用 `useI18n` 组合式函数
3. [全局注册](https://vuejs.org/guide/components/registration.html#global-registration) `i18n-t`、`i18n-d` 和 `i18n-n` 组件。

## 本指南中的约定

### 单文件组件

Vue I18n 最常用于使用打包工具（例如 Vite）和 [SFC](https://vuejs.org/guide/introduction.html#single-file-components)（即 `.vue` 文件）构建的应用程序中。本指南中的大多数示例都将采用这种风格编写，但 Vue I18n 本身并不要求你使用构建工具或 SFC。

例如，如果你使用的是 [Vue](https://vuejs.org/guide/quick-start.html#using-vue-from-cdn) 和 [Vue I18n](../installation#Direct-Download-CDN) 的_全局构建版本_，这些库会通过全局对象暴露，而不是通过导入：

```js
const { createApp } = Vue
const { createI18n, useI18n } = VueI18n
```

### 组件 API 风格

Vue I18n v12 仅使用 Composition API。本指南中的示例通常使用 `<script setup>`，而不是显式的 `setup` 函数。

如果你需要复习 Vue 的 Composition API，请参阅 [Vue - API 风格](https://vuejs.org/guide/introduction.html#api-styles)。

在模板中，你可以使用从 `useI18n()` 返回的 `t()`，或使用默认通过全局注入（`globalInjection: true`）提供的 `$t`。

:::tip NOTE
如果你正在使用 Vue I18n v11 或更早版本的 Legacy API 模式，请参阅 [v11 指南](../v11/essentials/started)。
:::

# Web Components

:::tip 支持的版本
:new: 9.2+
:::

:::tip
本章的完整示例代码在 [这里](https://github.com/intlify/vue-i18n/tree/master/examples/web-components)
:::

Vue 3.2 及更高版本，我们可以按照 [官方文档](https://cn.vuejs.org/guide/extras/web-components.html) 中的描述使用 Web Components。

这将支持从 Vue I18n v9.2 开始在 Web Components 中使用 Vue I18n。

在 Web Components 中使用 Vue I18n 时，有几点需要注意。

## 准备 Web Components 以托管 I18n 实例

使用 Vue 3.2 以来支持的 `defineCustomElement`，我们可以将 SFC 中实现的 Vue 组件作为 Web Components 提供。这意味着使用 `useI18n` 实现的 Vue 组件可以作为支持 i18n 的 Web Components 提供。

但是，提供的 Web Components 不能直接插入 HTML 中。你需要准备以下 Web Components 来托管由 `createI18n` 创建的 i18n 实例。

托管 i18n 实例的 Web Components：

```vue
<script setup lang="ts">
import { provide } from 'vue'
import { createI18n, I18nInjectionKey } from 'vue-i18n'

/**
 * 创建一个 i18n 实例以供其他 Web Components 托管
 */
const i18n = createI18n<false>({
  locale: 'en',
  messages: {
    en: {
      hello: 'Hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  }
})

/**
 * 为其他 Web Components 提供带有 `I18nInjectionKey` 的 i18n 实例
 */
provide(I18nInjectionKey, i18n)
</script>

<!-- 用于插槽内容的模板 -->
<template>
  <slot />
</template>
```

上面的代码有以下三点。

- 调用 `createI18n` 创建一个 i18n 实例
- 在 `setup` 中，在 `provide` 中指定使用 `createI18n` 创建的 i18n 实例以及 `I18nInjectionKey`
- 模板只有 `slot` 元素

在 `script` 块中，我们首先使用 `createI18n` 创建一个 i18n 实例。在 Vue 应用程序中，通过在 `createApp` 创建的 Vue 应用程序 `app.use` 中指定 i18n 实例，可以将 `createI18n` 创建的 i18n 实例用作 Vue 插件。

如果你使用 `defineCustomElement`，则无法再从 Vue 应用程序端控制 Vue 组件，因此即使你在 Vue 应用程序中运行组件的 Web Components 版本，也无法通过 `app.use` 从 Vue 应用程序端将 `createI18n` 创建的 i18n 实例附加到目标 Web Components。

因此，为了将 i18n 实例附加到 Web Components，我们在 `setup` 中使用 `provide` 将 i18n 实例公开给其他 Web Components。这允许使用 `useI18n` 实现 i18n 的 Web Components 通过被运行 `provide` 的 Web Components 托管来工作。

然后，为了托管其他 Web Components，`template` 块通过使用 `slot` 元素使这成为可能。

导出此托管的 Web Components 如下：

```js
import { defineCustomElement } from 'vue'
import I18nHost from './components/I18nHost.ce.vue'

const I18nHostElement = defineCustomElement(I18nHost)

export { I18nHostElement }
```

以下 `useI18n` 实现并导出 Web Components：

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <p>{{ t('hello') }}</p>
</template>
```

```js
import { defineCustomElement } from 'vue'
import HelloI18n from './components/HelloI18n.ce.vue'

const HelloI18nElement = defineCustomElement(HelloI18n)
export { HelloI18nElement }
```

当以下 Vue 应用程序注册为 Web Components 的自定义元素时：

<!-- eslint-skip -->

```js
import { createApp } from 'vue'
import { I18nHostElement } from './path/to/I18nHostElement'
import { HelloI18nElement } from './path/to/HelloI18nElement'
import App from './App.vue'

customElements.define('i18n-host', I18nHostElement)
customElements.define('hello-i18n', HelloI18nElement)

createApp(App).mount('#app')
```

因此，在作为 Vue 应用程序入口点的 `App.vue` 中，以下模板将起作用：

```vue
<template>
  <i18n-host>
    <h1>Vue I18n in Web component</h1>
    <hello-i18n />
  </i18n-host>
</template>
```

到目前为止描述的完整示例可以在 [这里](https://github.com/intlify/vue-i18n/tree/master/examples/web-components) 查看。

## 限制

1. 可用于实现 Web Components 的 Vue I18n 仅为 **组合式 API**。
2. 在实现 Web Components 时，**不能导入并一起使用用 `useI18n` 实现的 Vue 组件**。这是由于 Vue.js 对 Web Components 的 [Provide / Inject](https://cn.vuejs.org/guide/extras/web-components.html#building-custom-elements-with-vue) 限制。

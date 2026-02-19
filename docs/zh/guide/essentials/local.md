# 基于本地作用域的本地化

## 使用 `useI18n` 和本地消息

[在 *"作用域和区域设置更改"*](scope) 中提到，Vue I18n 有两个作用域概念：全局作用域和本地作用域。

通常，区域设置信息（例如 `locale`、`messages` 等）被设置为 `createI18n` 的选项，并通过 `app.use` 进行设置（安装）。总之，你使用全局作用域翻译函数 `t`（从 `useI18n()` 获取）或 `$t` 来本地化它们。

有时，有必要在管理本地消息资源的同时按组件进行本地化。在这种情况下，使用 `useI18n()` 配合本地消息或 `<i18n>` 自定义块而不是全局作用域来本地化每个本地作用域可能很有用。

:::tip NOTE
如果你正在使用 Vue I18n v11 或更早版本的 `i18n` 组件选项，请参阅 [v11 指南](../v11/essentials/local)。
:::

以下是基于本地作用域的本地化的示例：

**main.js:**

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

// setting locale info used by global scope as options
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello world',
        greeting: 'good morning, world!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、世界',
        greeting: 'おはよう、世界！'
      }
    }
  }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
```

**Component1.vue**（使用 `useI18n` 的本地作用域）：

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  messages: {
    en: { message: { hello: 'hello component1' } },
    ja: { message: { hello: 'こんにちは、component1' } }
  }
})
</script>

<template>
  <div class="component">
    <h1>Component1</h1>
    <p>Component1 locale messages: {{ t("message.hello") }}</p>
    <p>Fallback global locale messages: {{ t("message.greeting") }}</p>
  </div>
</template>
```

**App.vue:**

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import Component1 from './Component1.vue'

const { t } = useI18n()
</script>

<template>
  <div id="app">
    <h1>Root</h1>
    <p>{{ t("message.hello") }}</p>
    <Component1 />
  </div>
</template>
```

输出以下内容：

```html
<div id="app">
  <h1>Root</h1>
  <p>こんにちは、世界</p>
  <div class="component">
    <p>Component1 locale messages: こんにちは、component1</p>
    <p>Fallback global locale messages: おはよう、世界！</p>
  </div>
</div>
```

如上例所示，如果组件没有区域设置消息，它会回退到全局作用域。正如 [本地作用域](scope#本地作用域-1) 部分所解释的，由于本地作用域的 `locale` 继承自全局作用域，因此组件使用全局作用域中设置的语言（在上例中为 `locale: 'ja'`）。

另外，正如 [使用一个语言环境进行显式回退](fallback#explicit-fallback-with-one-locale) 部分所解释的，请注意，默认情况下，回退到全局作用域会在控制台中生成两个警告：

```txt
[intlify] Not found 'message.greeting' key in 'ja' locale messages.
[intlify] Fall back to translate 'message.greeting' with root locale.
```

如果你想使用组件区域设置进行本地化，可以在 `useI18n()` 的选项中使用 `inheritLocale: false` 和 `locale` 来实现。

## 组件共享区域设置消息

有时你可能希望为某些组件导入共享的区域设置消息，而不是从全局作用域的区域设置消息回退（例如，组件的某些功能的通用消息）。

你可以使用 `useI18n()` 的 `messages` 选项将共享消息合并到组件的本地作用域中。

通用区域设置消息示例：

```js
export default {
  en: {
    buttons: {
      save: "Save",
      // ...
    }
  },
  ja: {
    buttons: {
      save: "保存",
      // ...
    }
  }
}
```

使用共享消息的组件：

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import commonMessages from './locales/common'

const { t } = useI18n({
  messages: {
    en: { ...commonMessages.en, /* component-specific messages */ },
    ja: { ...commonMessages.ja, /* component-specific messages */ }
  }
})
</script>

<template>
  <div class="modal">
    <div class="body">
      <p>This is good service</p>
    </div>
    <div class="footer">
      <button type="button">{{ t('buttons.save') }}</button>
    </div>
  </div>
</template>
```

共享消息将合并到目标组件的 Composer 实例的区域设置消息中。

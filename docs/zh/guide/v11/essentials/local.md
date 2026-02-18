:::warning v11 文档
这是 **Vue I18n v11** 的文档。如果您使用的是 v12 或更高版本，请参阅 [最新指南](/zh/guide/essentials/started)。
:::

# 基于本地作用域的本地化

## i18n 组件选项

[在 *“作用域和区域设置更改”*](scope) 中提到，Vue I18n 有两个作用域概念：全局作用域和本地作用域。

通常，区域设置信息（例如 `locale`、`messages` 等）被设置为 `createI18n` 的选项，并通过 `app.use` 进行设置（安装）。总之，你使用全局作用域翻译函数 `$t` 来本地化它们。

有时，有必要在管理本地消息资源的同时按组件进行本地化。在这种情况下，使用组件上的 `i18n` 组件选项而不是全局作用域来本地化每个本地作用域可能很有用。

以下是基于本地作用域的本地化的示例：

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

// 设置全局作用域使用的区域设置信息作为选项
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

// 定义组件
const Component1 = {
  template: `
    <div id="component">
      <h1>Component1</h1>
      <p>Component1 locale messages: {{ $t("message.hello") }}</p>
      <p>Fallback global locale messages: {{ $t("message.greeting") }}</p>
    </div>
  `,
  i18n: {
    messages: {
      en: { message: { hello: 'hello component1' } },
      ja: { message: { hello: 'こんにちは、component1' } }
    }
  }
}

const app = createApp({
  components: { Component1 }
})
app.use(i18n)
app.mount('#app')
```

模板：

<!-- eslint-skip -->

```html
<div id="app">
  <h1>Root</h1>
  <p>{{ $t("message.hello") }}</p>
  <Component1 />
</div>
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

如上例所示，如果组件没有区域设置消息，它会回退到全局作用域。正如 [这里](scope#local-scope-2) 所解释的，由于本地作用域的 `locale` 继承自全局作用域，因此组件使用全局作用域中设置的语言（在上例中为 `locale: 'ja'`）。

另外，正如 [这里](fallback#explicit-fallback-with-one-locale) 所解释的，请注意，默认情况下，回退到全局作用域会在控制台中生成两个警告：

```txt
[intlify] Not found 'message.greeting' key in 'ja' locale messages.
[intlify] Fall back to translate 'message.greeting' with root locale.
```

如果你想使用组件区域设置进行本地化，可以使用 `i18n` 组件选项中的 `sync: false` 和 `locale` 来实现。

## 组件共享区域设置消息

有时你可能希望为某些组件导入共享的区域设置消息，而不是从全局作用域的区域设置消息回退（例如，组件的某些功能的通用消息）。

你可以使用 `i18n` 的 `sharedMessages` 选项。

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

组件：

<!-- eslint-skip -->

```js
import commonMessage from './locales/common' // 导入通用区域设置消息

export default {
  name: 'ServiceModal',
  template: `
    <div class="modal">
      <div class="body">
        <p>This is good service</p>
      </div>
      <div class="footer">
        <button type="button">{{ $t('buttons.save') }}</button>
      </div>
    </div>
  `,
  i18n: {
    messages: { ... },
    sharedMessages: commonMessages
  }
}
```

如果 `sharedMessages` 选项与 `messages` 选项一起指定，这些消息将合并到目标组件的 VueI18n 实例中的区域设置消息中。
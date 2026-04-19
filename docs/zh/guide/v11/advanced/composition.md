:::warning v11 文档
这是 **Vue I18n v11** 的文档。如果您使用的是 v12 或更高版本，请参阅 [最新指南](/zh/guide/essentials/started)。
:::

# 组合式 API

`setup` 和 Vue 的 [组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html) 的引入开辟了新的可能性。但为了充分利用 Vue I18n 的潜力，我们需要使用一些新函数来替换对 `this` 的访问。

我们一直在使用传统 API 描述 Vue I18n 的功能，该 API 与 vue-i18n v8.x 兼容。现在让我们看看用于组合式 API 的 Vue I18n `useI18n`。

## 基本用法

让我们看看 Vue I18n 组合式 API 的基本用法！这里我们将通过修改 [快速开始](../essentials/started) 中的代码来学习基本用法。

要在 Vue 3 的 `setup` 中使用 `useI18n` 进行组合，你需要做一件事，你需要将 `createI18n` 函数的 `legacy` 选项设置为 `false`。

以下是向 `createI18n` 添加 `legacy` 选项的示例：

```js{4}
// ...

const i18n = VueI18n.createI18n({
  legacy: false, // 你必须设置为 `false`，才能使用组合式 API // [!code ++]
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

// ...
```

你可以设置 `legacy: false` 以允许 Vue I18n 切换 API 模式，从传统 API 模式切换到组合式 API 模式。

:::tip 注意
由 `createI18n` 创建的 i18n 实例的以下属性会改变其行为：

- `mode` 属性：`"legacy"` 到 `"composition"`
- `global` 属性：VueI18n 实例到 Composer 实例
:::

你现在准备在 `App.vue` 组件中使用 `useI18n` 了。代码如下所示：

<!-- eslint-skip -->

```vue
<script setup> // [!code ++]
import { useI18n } from 'vue-i18n' // [!code ++]
const { t } = useI18n() // [!code ++]
</script> // [!code ++]

<template>
  <h1>{{ $t("message.hello") }}</h1>
</template>
```

你必须在 `<script setup>` 的顶部调用 `useI18n`。

`useI18n` 返回一个 Composer 实例。Composer 实例提供翻译 API（如 `t` 函数）以及 `locale` 和 `fallbackLocale` 等属性，就像 VueI18n 实例一样。有关 Composer 实例的更多信息，请参阅 [API 参考](/api/general/interfaces/Composer.md)。

在上面的例子中，`useI18n` 没有选项，所以它返回一个与全局作用域一起工作的 Composer 实例。因此，它返回一个与全局作用域一起工作的 Composer 实例，这意味着这里传播的 `t` 函数引用的本地化消息是在 `createI18n` 中指定的消息。

你可以在组件模板中使用 `t`：

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <h1>{{ $t("message.hello") }}</h1> // [!code --]
  <h1>{{ t("message.hello") }}</h1> // [!code ++]
</template>
```

输出如下：

```vue
<div id="app">
  <h1>こんにちは、世界</h1>
</div>
```

## 消息翻译

在传统 API 模式下，消息是使用 `$t` 或 VueI18n 实例的 `t` 翻译的。

在组合式 API 模式下，消息格式语法与传统 API 模式保持相同。你可以使用 Composer 实例 `t` 来翻译消息，如下所示：

```vue
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      msg: 'hello',
      named: '{msg} world!',
      list: '{0} world!',
      literal: "{'hello'} world!",
      the_world: 'the world',
      dio: 'DIO:',
      linked: '@:dio @:the_world !!!!'
    },
    ja: {
      msg: 'こんにちは',
      named: '{msg} 世界！',
      list: '{0} 世界！',
      literal: "{'こんにちは'} 世界！",
      the_world: 'ザ・ワールド！',
      dio: 'ディオ:',
      linked: '@:dio @:the_world ！！！！'
    }
  }
})

const msg = computed(() => t('msg'))
</script>

<template>
  <p>{{ t('named', { msg }) }}</p>
  <p>{{ t('list', [msg]) }}</p>
  <p>{{ t('literal') }}</p>
  <p>{{ t('linked') }}</p>
</template>

```

有关 `t` 的更多详细信息，请参阅 [API 参考](/api/general/interfaces/Composer.md#t)

## 复数形式

在组合式 API 模式下，消息的复数形式在语法上与传统 API 模式相同，但使用 Composer 实例的 `t` 进行翻译：

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      car: 'car | cars',
      apple: 'no apples | one apple | {count} apples',
      banana: 'no bananas | {n} banana | {n} bananas'
    }
  }
})
</script>

<template>
  <h2>Car:</h2>
  <p>{{ t('car', 1) }}</p>
  <p>{{ t('car', 2) }}</p>
  <h2>Apple:</h2>
  <p>{{ t('apple', 0) }}</p>
  <p>{{ t('apple', 1) }}</p>
  <p>{{ t('apple', { count: 10 }, 10) }}</p>
  <p>{{ t('apple', 10) }}</p>
  <h2>Banana:</h2>
  <p>{{ t('banana', { n: 1 }, 1) }}</p>
  <p>{{ t('banana', 1) }}</p>
  <p>{{ t('banana', { n: 'too many' }, 100) }}</p>
</template>
```

:::tip 注意
在组合式 API 模式下，复数翻译已集成到 `t` 中。
:::

## 日期时间格式化

在传统 API 模式下，日期时间值使用 `$d` 或 VueI18n 实例的 `d` 进行格式化。

在组合式 API 模式下，它使用 Composer 实例的 `d` 进行格式化：

```vue
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, d } = useI18n({
  locale: 'en-US',
  messages: {
    'en-US': {
      current: 'Current Datetime'
    }
  },
  datetimeFormats: {
    'en-US': {
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    }
  }
})

const now = ref(new Date())
</script>

<template>
  <p>{{ t('current') }}: {{ d(now, 'long') }}</p>
</template>

```

有关 `d` 的更多详细信息，请参阅 [API 参考](/api/general/interfaces/Composer.md#d)

## 数字格式化

在传统 API 模式下，数值使用 `$n` 或 VueI18n 实例的 `n` 进行格式化。

在组合式 API 模式下，它使用 Composer 实例的 `n` 进行格式化：

```vue
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, n } = useI18n({
  locale: 'en-US',
  messages: {
    'en-US': {
      money: 'Money'
    }
  },
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    }
  }
})

const money = ref(1000)
</script>

<template>
  <p>{{ t('money') }}: {{ n(money, 'currency') }}</p>
</template>
```

有关 `n` 的更多详细信息，请参阅 [API 参考](/api/general/interfaces/Composer.md#n)

## 全局作用域

组合式 API 模式下的全局作用域是在使用 `createI18n` 创建 i18n 实例时创建的，类似于传统 API 模式。

虽然 i18n 实例的传统 API 模式 `global` 属性是 VueI18n 实例，但组合式 API 模式允许你引用 Composer 实例。

有两种方法可以在组件中引用全局作用域 Composer 实例。

### 使用 `useI18n` 显式引用

正如我们已经解释的那样，`useI18n` 是一种方式。

<!-- eslint-skip -->

```ts
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

// 这里做一些事情 ...
```

上面的代码将 `useI18n` 选项设置为 `useScope: 'global'`，这允许 `useI18n` 返回一个可以通过 i18n 实例 `global` 属性访问的 Composer 实例。Composer 实例是一个全局作用域。

然后你可以使用从 Composer 实例公开的函数和属性进行组合。

:::tip 注意
如果你将 `useI18n` 设置为 `messages`、`datetimeFormats` 和 `numberFormats` 以及 `useScope: 'global'`，**它们将被合并到全局作用域中**。也就是说，它们将由全局作用域 Composer 实例的 `messages`、`datetimeFormats` 和 `numberFormats` 管理。

此外，如果 [在 i18n 自定义块中指定了 `global`](../advanced/sfc#define-locale-messages-for-global-scope)（例如 `<i18n global>{ … }</i18n>`），则块中定义的语言环境消息将与全局作用域合并。
:::

### 使用注入的属性和函数隐式引用

另一种引用全局作用域 Composer 实例的方法是通过隐式注入到组件中的属性和函数。

你需要指定 **`globalInjection: true`** 和 `legacy: false` 作为 `createI18n` 的选项，因为默认情况下是禁用的。

:::tip 注意
vue-i18n v9.2-beta.34 或更高版本，`globalInjection` 默认为 `true`。
:::

这允许 Vue I18n 将以下属性和函数注入到组件中：

- `$i18n`: 包含以下全局作用域 Composer 实例属性的对象
  - `locale`
  - `fallbackLocale`
  - `availableLocales`
- `$t`: 全局作用域的 Composer 的 `t` 函数
- `$rt`: 全局作用域的 Composer 的 `rt` 函数
- `$d`: 全局作用域的 Composer 的 `d` 函数
- `$n`: 全局作用域的 Composer 的 `n` 函数
- `$tm`: 全局作用域的 Composer 的 `tm` 函数

Vue 3 运行时会全局注入组件，并在 `app.config.globalProperties` 中进行设置。因此，上面列出的那些是由 Vue 3 运行时注入的，因此可以在模板中隐式使用。

:::warning 注意
- `setup` 不允许查看这些注入到组件中的属性和函数
- 在传统 API 模式下，注入了一些以 `$` 为前缀的 Vue I18n API，但在组合式 API 模式下，以 `$` 为前缀并注入组件的属性和函数与传统 API 模式不同。
:::

你已经注意到上面列出的那些以 `$` 为前缀。给它们加上 `$` 前缀的原因是它们是：

- `setup` 不会与渲染上下文返回的属性和函数冲突
- Vue I18n 组合式 API 模式的全局作用域可访问标识符

通过这样做，用户会意识到它们是特殊的属性和函数。

:::warning 注意
如果你的 Vue 应用程序不使用本地作用域，并且在全局作用域中执行所有 i18n 操作，这非常有用，因为它不需要为每个组件在 `setup` 中运行 `useI18n`。但是，这种方式存在同性质全局变量的问题。你应该谨慎使用，尤其是在大型 Vue 应用程序中。

如果你使用了一次并停止使用它，你必须将模板中使用的所有属性或函数更改为使用带有 `useScope: 'global'` 选项的 `useI18n` 的 `setup` 返回的设置上下文的属性或函数。
:::

## 本地作用域

在传统 API 模式下，VueI18n 实例是通过为每个组件指定 `i18n` 组件选项来创建的。这使得诸如 VueI18n 实例管理的本地消息之类的资源成为只能由目标组件引用的本地作用域。

要在组合式 API 模式下启用本地作用域，你需要为 `useI18n` 设置一个选项，这将根据给定的区域设置、语言环境消息等创建一个新的 Composer 实例。当给出选项时，`useI18n` 根据选项指定的区域设置、语言环境消息和其他资源创建并返回一个新的 Composer 实例。

:::tip 注意
你可以显式指定 `useScope: ‘local’` 选项。
:::

以下示例代码：

<!-- eslint-skip -->

```js
import { useI18n } from 'vue-i18n'

const { t, d, n, tm, locale } = useI18n({
  locale: 'ja-JP',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': {
      // ....
    },
    'ja-JP': {
      // ...
    }
  },
  datetimeFormats: {
    'en-US': {
      // ....
    },
    'ja-JP': {
      // ...
    }
  },
  numberFormats: {
    'en-US': {
      // ....
    },
    'ja-JP': {
      // ...
    }
  }
})

// 这里做一些事情 ...
```

### 语言环境消息

如果在 SFC 中使用 i18n 自定义块作为语言环境消息的 i18n 资源，它将与 `useI18n` 的 `messages` 选项指定的语言环境消息合并。

以下是使用 i18n 自定义块和 `useI18n` 选项的示例：

<!-- eslint-skip -->

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import en from './en.json'

const { t, availableLocales, getLocaleMessages } = useI18n({
  locale: 'en',
  messages: {
    en
  }
})

availableLocales.forEach(locale => {
  console.log(`${locale} locale messages`, getLocaleMessages(locale))
})
</script>

<i18n locale="ja">
{
  "hello": "こんにちは！"
}
</i18n>
```

:::tip 注意
在此示例中，资源的定义与 i18n 自定义块和 `useI18n` 的 `messages` 选项分离，但在本地作用域中，出于资源消息管理的目的，在 `messages` 选项中一次性指定资源消息或在 i18n 自定义块中定义所有资源消息是可取的。
:::

### 组件共享语言环境消息

在传统 API 模式下，共享语言环境消息在具有 `sharedMessages` 选项的组件中使用。

在组合式 API 模式下，使用从 `useI18n` 导出的 `mergeLocaleMessage`。

通用语言环境消息示例：

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

在组件上使用 `mergeLocaleMessage`：

<!-- eslint-skip -->

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import commonMessages from './locales/common'

const { t, mergeLocaleMessage } = useI18n({
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

for (const locale of ['en', 'ja']) {
  mergeLocaleMessage(locale, commonMessages[locale])
}
</script>
```

## 区域设置更改

### 全局作用域

你想用 `<script setup>` 更改区域设置，只需使用 `useI18n` 获取全局 Composer 并使用实例的 `locale` 属性更改它。

<!-- eslint-skip -->

```vue
<script setup>
const { t, locale } = useI18n({ useScope: 'global' })

locale.value = 'en' // 更改！
</script>
```

你也可以在模板中使用设置上下文，可以如下更改：

```vue
<select v-model="locale">
  <option value="en">en</option>
  <option value="ja">ja</option>
</select>
```

当你更改全局作用域的区域设置时，依赖于全局作用域的组件（例如 `t` 翻译 API）可以响应式地工作，并将显示消息切换为目标区域设置的消息。

如果你使用 [隐式方式](composition#implicit-with-injected-properties-and-functions)，你也可以在模板中使用 `$i18n.locale` 更改它，如下所示：

```vue
<select v-model="$i18n.locale">
  <option value="en">en</option>
  <option value="ja">ja</option>
</select>
```

### 本地作用域

本地作用域区域设置，即 `useI18n` 返回的 Composer 实例 `locale` 属性，是从全局作用域继承的，就像传统 API 一样。因此，当你更改全局作用域的区域设置时，继承的本地作用域区域设置也会更改。如果你想切换整个应用程序的区域设置，你可以使用 `useI18n({ useScope: 'global' })` 返回的 `locale`，或者如果你使用 [隐式方式](composition#implicit-with-injected-properties-and-functions)，你可以使用 `$i18n.locale`。

:::tip 注意
如果你不想从全局作用域继承区域设置，`useI18n` 的 `inheritLocale` 选项必须为 `false`。
:::

:::warning 注意
本地作用域中对 `locale` 的更改 **对全局作用域区域设置没有影响，仅在本地作用域内有效**。
:::

## VueI18n 实例与 Composer 实例之间的映射

组合式 API 中的 Composer 实例提供的 API 与 VueI18n 实例提供的 API 非常相似。

:::tip 备注
在内部，传统 API 模式的 VueI18n 实例通过包装 Composer 实例来工作。
因此，组合式 API 模式下的性能开销小于传统 API 模式。
:::

以下是映射表：

| VueI18n 实例 | Composer 实例 |
| ----------------- | ----------------------- |
| `id` | `id` |
| `locale` | `locale` |
| `fallbackLocale` | `fallbackLocale` |
| `availableLocales` | `availableLocales` |
| `messages` | `messages` |
| `datetimeFormats` | `datetimeFormats` |
| `numberFormats` | `numberFormats` |
| `modifiers` | `modifiers` |
| `missing` | `getMissingHandler` / `setMissingHandler` |
| `postTranslation` | `getPostTranslationHandler` / `setPostTranslationHandler`|
| `silentTranslationWarn` | `missingWarn` |
| `silentFallbackWarn` | `fallbackWarn` |
| `formatFallbackMessages` | `fallbackFormat` |
| `sync` | `inheritLocale` |
| `warnHtmlInMessage` | `warnHtmlMessage` |
| `escapeParameterHtml` | `escapeParameter` |
| `t` | `t` |
| `tc` | `t` |
| `te` | `te` |
| `tm` | `tm` |
| `getLocaleMessage` | `getLocaleMessage` |
| `setLocaleMessage` | `setLocaleMessage`|
| `mergeLocaleMessage` | `mergeLocaleMessage` |
| `d` | `d` |
| `getDateTimeFormat` | `getDateTimeFormat` |
| `setDateTimeFormat` | `setDateTimeFormat` |
| `mergeDateTimeFormat` | `mergeDateTimeFormat` |
| `n` | `n` |
| `getNumberFormat` | `getNumberFormat` |
| `setNumberFormat` | `setNumberFormat` |
| `mergeNumberFormat` | `mergeNumberFormat` |
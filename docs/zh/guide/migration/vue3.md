# Vue 3 中的迁移

## 从传统 API 迁移到组合式 API

### 摘要

Vue I18n 支持传统 API 模式和组合式 API 模式两种风格。传统 API 模式是选项式 API 风格，组合式 API 模式支持可以使用函数进行组合的 Vue 组合式 API。

传统 API 模式几乎与旧版 Vue I18n v8.x 兼容，使得将 Vue 应用程序迁移到 Vue 3 相对容易。Vue 3 支持选项式 API 风格，因此现有的 Vue 2 应用程序将有迁移到 Vue 3 的情况。

Vue 3 允许你混合使用选项式 API 风格和组合式 API 风格来制作 Vue 应用程序，但 Vue I18n 自 v9 初始版本以来就不允许混合使用这些 API 风格，因此你只能使用其中一种 API 风格。

从维护的角度来看，开发混合使用选项式 API 风格和组合式 API 风格的 Vue 应用程序并不是一个理想的软件开发项目。这是因为维护此类代码的成本很高。但是，使用这两种风格也有优点。特别是，API 风格迁移更容易逐步迁移，因为它即使在两种 API 风格都实现时也能工作。

从 Vue I18n v9.2 开始，传统 API 模式也可以与组合式 API 模式一起使用。

### 关于支持

:::danger 注意
此迁移支持将在下一个主要版本 v10 中移除。如果你的 Vue 3 应用程序项目尚未迁移，请将其迁移到 v9，然后再升级到 v10。
:::

### 限制

:::warning 通知
你应该将其理解为用于迁移的有限功能。
:::

- 传统 API 模式下的组合式 API 不支持 SSR
- 如果你想在 `setup` 函数上下文中直接（而不是在 `<template>` 中）正确使用 Vue I18n 组合式 API（例如 `t`），你需要通过 `nextTick` 回调上下文调用。

### 如何迁移

#### `createI18n`

你需要为 `createI18n` 选项指定 `allowComposition: true`。如下例所示：

```js
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  allowComposition: true, // 你需要指定这个！
  messages: {
    en: {
      hello: 'hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  }
})

console.log(i18n.allowComposition) // 输出 true
```

### Vue 组件中的 `useI18n`
#### `setup` 选项

<!-- eslint-skip -->

```vue
<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Hello',
  setup() {
    const { t } = useI18n() // 作为全局作用域使用
    return { t }
  }
})
</script>

<template>
  <p>{{ $t('hello') }}</p>
  <p>{{ t('hello') }}</p>
</template>
```

#### `<script setup>`

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n() // 作为全局作用域使用
</script>

<template>
  <p>{{ $t('hello') }}</p>
  <p>{{ t('hello') }}</p>
</template>
```

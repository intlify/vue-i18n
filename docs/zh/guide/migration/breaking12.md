# v12 重大变更

## 放弃传统 API 模式

**原因**: 传统 API 模式已在 v11 中弃用，正如 [v11 重大变更](./breaking11.md#deprecate-legacy-api-mode) 中所宣布的那样。它是与 Vue 2 的 Vue I18n v8 兼容的 API 模式，旨在平滑从 v8 到 v9 的迁移。

在 v12 中，传统 API 模式已被完全移除。`createI18n` 中的 `legacy` 选项不再可用，所有应用程序必须使用组合式 API 模式。

### 移除了什么

- `createI18n` 中的 `legacy: true` 选项
- `VueI18n` 实例（传统接口）
- `VueI18nOptions` 类型
- `allowComposition` 选项（不再需要，因为组合式 API 是唯一的模式）
- 依赖于 `VueI18n` 实例的特定于传统的注入 API

### 之前 (v11)

```typescript
import { createI18n } from 'vue-i18n'

// 传统 API 模式
const i18n = createI18n({
  legacy: true, // 在早期版本中这是默认值
  locale: 'en',
  messages: {
    en: { hello: 'Hello!' },
    ja: { hello: 'こんにちは！' }
  }
})

// 通过 VueI18n 实例访问
i18n.global.locale = 'ja'
```

```html
<!-- 在选项式 API 组件中 -->
<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  mounted() {
    // 通过 this.$i18n (VueI18n 实例) 访问
    console.log(this.$i18n.locale)
    this.$i18n.locale = 'ja'
  }
}
</script>
```

### 之后 (v12)

```typescript
import { createI18n } from 'vue-i18n'

// 组合式 API 模式 (唯一可用模式)
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { hello: 'Hello!' },
    ja: { hello: 'こんにちは！' }
  }
})

// 通过 Composer 实例访问
i18n.global.locale.value = 'ja'
```

```html
<!-- 使用组合式 API -->
<template>
  <p>{{ t('hello') }}</p>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 更改语言环境
locale.value = 'ja'
</script>
```

```html
<!-- 在 setup 中使用 useI18n 的选项式 API -->
<template>
  <p>{{ t('hello') }}</p>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t, locale } = useI18n()
    return { t, locale }
  }
}
</script>
```

### 迁移

1. 从 `createI18n` 中移除 `legacy: true` 选项
2. 将语言环境访问从 `i18n.global.locale` 更改为 `i18n.global.locale.value`
3. 在 setup 函数中将 `this.$i18n` 用法替换为 `useI18n()`
4. 将 `this.$t()` 替换为 `useI18n()` 中的 `t()`

有关详细的迁移指南，请参阅：
- [从传统 API 模式迁移到组合式 API 模式](https://vue-i18n.intlify.dev/guide/migration/vue3.html)
- [组合式 API 使用方法](https://vue-i18n.intlify.dev/guide/advanced/composition.html)

## 放弃自定义指令 `v-t`

**原因**: 此自定义指令已弃用并警告将在 v12 中删除。文档说明：https://vue-i18n.intlify.dev/guide/migration/breaking11.html#deprecate-custom-directive-v-t

## 更改 `MissingHandler` 签名

**原因**: Vue 3.6+ 弃用了 `getCurrentInstance()` API。`MissingHandler` 类型以前接收 `ComponentInternalInstance` 作为第三个参数，但这不再可用。

### 之前 (v11)

```typescript
type MissingHandler = (
  locale: Locale,
  key: Path,
  instance?: ComponentInternalInstance,
  type?: string
) => string | void

const i18n = createI18n({
  missing: (locale, key, instance, type) => {
    // instance 是 ComponentInternalInstance
    console.warn(`Missing: ${key}`, instance?.uid)
  }
})
```

### 之后 (v12)

```typescript
type MissingHandler = (
  locale: Locale,
  key: Path,
  uid?: number,
  type?: string
) => string | void

const i18n = createI18n({
  missing: (locale, key, uid, type) => {
    // uid 现在直接作为数字传递
    console.warn(`Missing: ${key}`, uid)
  }
})
```

### 迁移

将 `instance` 参数替换为 `uid`：

```diff
 const i18n = createI18n({
-  missing: (locale, key, instance, type) => {
-    console.warn(`Missing key "${key}" in ${locale}`, instance?.uid)
+  missing: (locale, key, uid, type) => {
+    console.warn(`Missing key "${key}" in ${locale}`, uid)
   }
 })
```

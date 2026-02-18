# 自定义指令（已移除）

:::danger 已移除
`v-t` 自定义指令在 v11 中已弃用，并已在 **v12 中移除**。
:::

如果你正在使用 Vue I18n v11 或更早版本，请参阅 [v11 自定义指令指南](../v11/advanced/directive)。

## 迁移

将所有 `v-t` 指令的用法替换为 `useI18n()` 的 `t()`，或 `$t`（通过 `globalInjection: true` 可用）。

### 字符串语法

```html
<!-- Before (v11 and earlier) -->
<p v-t="'hello'"></p>

<!-- After (v12) -->
<p>{{ t('hello') }}</p>
```

### 对象语法（命名参数）

```html
<!-- Before (v11 and earlier) -->
<p v-t="{ path: 'hello', args: { name: userName } }"></p>

<!-- After (v12) -->
<p>{{ t('hello', { name: userName }) }}</p>
```

### 对象语法（复数形式）

```html
<!-- Before (v11 and earlier) -->
<p v-t="{ path: 'car', plural: count }"></p>

<!-- After (v12) -->
<p>{{ t('car', count) }}</p>
```

### 对象语法（覆盖区域设置）

```html
<!-- Before (v11 and earlier) -->
<p v-t="{ path: 'hello', locale: 'ja' }"></p>

<!-- After (v12) -->
<p>{{ t('hello', {}, { locale: 'ja' }) }}</p>
```

### 完整组件示例

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <p>{{ t('hello') }}</p>
  <p>{{ t('message.hi', { name: 'kazupon' }) }}</p>
</template>
```

有关迁移的更多详情，请参阅 [v12 破坏性变更](../migration/breaking12#drop-custom-directive-v-t)。

# カスタムディレクティブ（削除済み）

:::danger 削除済み
`v-t` カスタムディレクティブは v11 で非推奨となり、**v12 で削除されました**。
:::

Vue I18n v11 以前を使用している場合は、[v11 カスタムディレクティブガイド](../v11/advanced/directive) を参照してください。

## 移行

すべての `v-t` ディレクティブの使用を、`useI18n()` の `t()` または `$t`（`globalInjection: true` で利用可能）に置き換えてください。

### 文字列構文

```html
<!-- Before (v11 and earlier) -->
<p v-t="'hello'"></p>

<!-- After (v12) -->
<p>{{ t('hello') }}</p>
```

### オブジェクト構文（名前付き引数）

```html
<!-- Before (v11 and earlier) -->
<p v-t="{ path: 'hello', args: { name: userName } }"></p>

<!-- After (v12) -->
<p>{{ t('hello', { name: userName }) }}</p>
```

### オブジェクト構文（複数形）

```html
<!-- Before (v11 and earlier) -->
<p v-t="{ path: 'car', plural: count }"></p>

<!-- After (v12) -->
<p>{{ t('car', count) }}</p>
```

### オブジェクト構文（ロケールの上書き）

```html
<!-- Before (v11 and earlier) -->
<p v-t="{ path: 'hello', locale: 'ja' }"></p>

<!-- After (v12) -->
<p>{{ t('hello', {}, { locale: 'ja' }) }}</p>
```

### コンポーネントの完全な例

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

移行の詳細については、[v12 破壊的変更](../migration/breaking12#drop-custom-directive-v-t) を参照してください。

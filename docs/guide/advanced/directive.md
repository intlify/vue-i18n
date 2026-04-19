# Custom Directive (Removed)

:::danger REMOVED
The `v-t` custom directive was deprecated in v11 and has been **removed in v12**.
:::

If you are using Vue I18n v11 or earlier, see the [v11 Custom Directive guide](../v11/advanced/directive).

## Migration

Replace all `v-t` directive usage with `t()` from `useI18n()`, or `$t` (available via `globalInjection: true`).

### String syntax

```html
<!-- Before (v11 and earlier) -->
<p v-t="'hello'"></p>

<!-- After (v12) -->
<p>{{ t('hello') }}</p>
```

### Object syntax (named arguments)

```html
<!-- Before (v11 and earlier) -->
<p v-t="{ path: 'hello', args: { name: userName } }"></p>

<!-- After (v12) -->
<p>{{ t('hello', { name: userName }) }}</p>
```

### Object syntax (pluralization)

```html
<!-- Before (v11 and earlier) -->
<p v-t="{ path: 'car', plural: count }"></p>

<!-- After (v12) -->
<p>{{ t('car', count) }}</p>
```

### Object syntax (locale override)

```html
<!-- Before (v11 and earlier) -->
<p v-t="{ path: 'hello', locale: 'ja' }"></p>

<!-- After (v12) -->
<p>{{ t('hello', {}, { locale: 'ja' }) }}</p>
```

### Full component example

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

For more details on the migration, see the [v12 Breaking Changes](../migration/breaking12#drop-custom-directive-v-t).

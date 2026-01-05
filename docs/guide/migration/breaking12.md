# Breaking Changes in v12

## Drop Legacy API mode

**Reason**: Legacy API mode was deprecated in v11 as announced in the [v11 breaking changes](./breaking11.md#deprecate-legacy-api-mode). It was the API mode compatible with Vue I18n v8 for Vue 2, provided to smooth the migration from v8 to v9.

With v12, Legacy API mode has been completely removed. The `legacy` option in `createI18n` is no longer available, and all applications must use Composition API mode.

### What's removed

- `legacy: true` option in `createI18n`
- `VueI18n` instance (the legacy interface)
- `VueI18nOptions` type
- `allowComposition` option (no longer needed as Composition API is the only mode)
- Legacy-specific injection APIs that depended on `VueI18n` instance

### Before (v11)

```typescript
import { createI18n } from 'vue-i18n'

// Legacy API mode
const i18n = createI18n({
  legacy: true, // This was the default in earlier versions
  locale: 'en',
  messages: {
    en: { hello: 'Hello!' },
    ja: { hello: 'こんにちは！' }
  }
})

// Access via VueI18n instance
i18n.global.locale = 'ja'
```

```html
<!-- In Options API component -->
<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  mounted() {
    // Access via this.$i18n (VueI18n instance)
    console.log(this.$i18n.locale)
    this.$i18n.locale = 'ja'
  }
}
</script>
```

### After (v12)

```typescript
import { createI18n } from 'vue-i18n'

// Composition API mode (only mode available)
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { hello: 'Hello!' },
    ja: { hello: 'こんにちは！' }
  }
})

// Access via Composer instance
i18n.global.locale.value = 'ja'
```

```html
<!-- Using Composition API -->
<template>
  <p>{{ t('hello') }}</p>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Change locale
locale.value = 'ja'
</script>
```

```html
<!-- Options API with useI18n in setup -->
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

### Migration

1. Remove `legacy: true` option from `createI18n`
2. Change locale access from `i18n.global.locale` to `i18n.global.locale.value`
3. Replace `this.$i18n` usage with `useI18n()` in setup function
4. Replace `this.$t()` with `t()` from `useI18n()`

For detailed migration guide, see:
- [Migration from Legacy API mode to Composition API mode](https://vue-i18n.intlify.dev/guide/migration/vue3.html)
- [Composition API usage](https://vue-i18n.intlify.dev/guide/advanced/composition.html)


## Drop Custom Directive `v-t`

**Reason**: This custom directive had already deprecated in warning about being dropped in v12. docs says, https://vue-i18n.intlify.dev/guide/migration/breaking11.html#deprecate-custom-directive-v-t

## Change `MissingHandler` signature

**Reason**: Vue 3.6+ deprecates `getCurrentInstance()` API. The `MissingHandler` type previously received a `ComponentInternalInstance` as the third parameter, but this is no longer available.

### Before (v11)

```typescript
type MissingHandler = (
  locale: Locale,
  key: Path,
  instance?: ComponentInternalInstance,
  type?: string
) => string | void

const i18n = createI18n({
  missing: (locale, key, instance, type) => {
    // instance was ComponentInternalInstance
    console.warn(`Missing: ${key}`, instance?.uid)
  }
})
```

### After (v12)

```typescript
type MissingHandler = (
  locale: Locale,
  key: Path,
  uid?: number,
  type?: string
) => string | void

const i18n = createI18n({
  missing: (locale, key, uid, type) => {
    // uid is now passed directly as a number
    console.warn(`Missing: ${key}`, uid)
  }
})
```

### Migration

Replace `instance` parameter with `uid`:

```diff
 const i18n = createI18n({
-  missing: (locale, key, instance, type) => {
-    console.warn(`Missing key "${key}" in ${locale}`, instance?.uid)
+  missing: (locale, key, uid, type) => {
+    console.warn(`Missing key "${key}" in ${locale}`, uid)
   }
 })
```

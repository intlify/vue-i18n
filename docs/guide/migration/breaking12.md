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

```ts
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

```ts
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

### Detailed migration guide

#### Template `$t` / `$d` / `$n` usage

In v12, `$t()`, `$d()`, `$n()`, `$rt()`, `$tm()`, `$te()` remain available in templates when `globalInjection: true` (the default). These reference the **global scope** Composer. For component-local scope, use `t()` from `useI18n()`.

```html
<!-- v12: $t is still available in templates (global scope) -->
<template>
  <p>{{ $t('hello') }}</p>
</template>
```

However, `this.$t()` in JavaScript code (`methods`, `computed`, `watch`, lifecycle hooks) is no longer available. You must use `useI18n()` in `setup()` instead.

**Before (v11):**

```js
export default {
  methods: {
    greet() {
      return this.$t('hello')
    }
  },
  computed: {
    message() {
      return this.$t('welcome', { name: this.user })
    }
  },
  watch: {
    lang(val) {
      this.$i18n.locale = val
    }
  },
  mounted() {
    console.log(this.$t('ready'))
    console.log(this.$d(new Date(), 'long'))
    console.log(this.$n(1000, 'currency'))
  }
}
```

**After (v12) - `<script setup>`:**

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import { watch, onMounted, computed } from 'vue'

const { t, d, n, locale } = useI18n()

function greet() {
  return t('hello')
}

const message = computed(() => t('welcome', { name: user.value }))

watch(lang, (val) => {
  locale.value = val
})

onMounted(() => {
  console.log(t('ready'))
  console.log(d(new Date(), 'long'))
  console.log(n(1000, 'currency'))
})
</script>
```

**After (v12) - Options API with `setup()`:**

```js
import { useI18n } from 'vue-i18n'
import { watch, onMounted, computed } from 'vue'

export default {
  setup() {
    const { t, d, n, locale } = useI18n()

    function greet() {
      return t('hello')
    }

    const message = computed(() => t('welcome', { name: user.value }))

    watch(lang, (val) => {
      locale.value = val
    })

    onMounted(() => {
      console.log(t('ready'))
      console.log(d(new Date(), 'long'))
      console.log(n(1000, 'currency'))
    })

    return { t, d, n, locale, greet, message }
  }
}
```

#### `$i18n` property changes

In v11, `this.$i18n` was a `VueI18n` instance with full access to all methods and properties. In v12, `$i18n` is changed to the `ExportedGlobalComposer` type, which exposes only the following properties:

| Property | Type | Description |
|---|---|---|
| `$i18n.locale` | `Locale` (string) | Current locale (get/set) |
| `$i18n.fallbackLocale` | `FallbackLocale` | Fallback locale (get/set) |
| `$i18n.availableLocales` | `Locale[]` | Available locales (read-only) |

Methods such as `this.$i18n.t()`, `this.$i18n.setLocaleMessage()`, etc. are no longer accessible via `$i18n`. Use `useI18n()` instead.

**Before (v11):**

```js
export default {
  mounted() {
    // VueI18n instance - full access to all methods
    this.$i18n.locale = 'ja'
    this.$i18n.setLocaleMessage('fr', { hello: 'Bonjour' })
    this.$i18n.mergeLocaleMessage('en', { goodbye: 'Goodbye' })
    console.log(this.$i18n.getLocaleMessage('en'))
    console.log(this.$i18n.t('hello'))
    console.log(this.$i18n.te('hello'))
    console.log(this.$i18n.tm('messages'))
    console.log(this.$i18n.d(new Date(), 'long'))
    console.log(this.$i18n.n(1000, 'currency'))
    this.$i18n.setDateTimeFormat('ja', { long: { /* ... */ } })
    this.$i18n.setNumberFormat('ja', { currency: { /* ... */ } })
    console.log(this.$i18n.silentTranslationWarn)
    console.log(this.$i18n.missing)
  }
}
```

**After (v12):**

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const {
  locale,
  t, te, tm, d, n,
  setLocaleMessage, mergeLocaleMessage, getLocaleMessage,
  setDateTimeFormat, setNumberFormat,
  getMissingHandler
} = useI18n()

onMounted(() => {
  locale.value = 'ja'
  setLocaleMessage('fr', { hello: 'Bonjour' })
  mergeLocaleMessage('en', { goodbye: 'Goodbye' })
  console.log(getLocaleMessage('en'))
  console.log(t('hello'))
  console.log(te('hello'))
  console.log(tm('messages'))
  console.log(d(new Date(), 'long'))
  console.log(n(1000, 'currency'))
  setDateTimeFormat('ja', { long: { /* ... */ } })
  setNumberFormat('ja', { currency: { /* ... */ } })
  console.log(getMissingHandler())
})
</script>
```

#### Component-local messages

In v11, the `i18n` component option allowed defining local messages. In v12, the `i18n` component option has been removed from `ComponentCustomOptions`.

**Before (v11):**

```js
export default {
  i18n: {
    messages: {
      en: { title: 'My Component' },
      ja: { title: 'マイコンポーネント' }
    }
  },
  template: '<h1>{{ $t("title") }}</h1>'
}
```

**After (v12) - Use `useI18n` with `useScope: 'local'`:**

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: { title: 'My Component' },
    ja: { title: 'マイコンポーネント' }
  }
})
</script>

<template>
  <h1>{{ t('title') }}</h1>
</template>
```

**After (v12) - Using SFC `<i18n>` custom block:**

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1>{{ t('title') }}</h1>
</template>

<i18n>
{
  "en": { "title": "My Component" },
  "ja": { "title": "マイコンポーネント" }
}
</i18n>
```

When a `<i18n>` custom block is present, `useI18n()` automatically uses local scope.

#### `createI18n` option name changes

The following table maps v11 Legacy API option names to their v12 Composition API equivalents:

| v11 (VueI18nOptions) | v12 (ComposerOptions) | Change |
|---|---|---|
| `legacy: true` | (removed) | Composition API only |
| `silentTranslationWarn` | `missingWarn` | Logic inverted (`true` → `false`, `false` → `true`) |
| `silentFallbackWarn` | `fallbackWarn` | Logic inverted |
| `formatFallbackMessages` | `fallbackFormat` | Renamed |
| `warnHtmlInMessage` | `warnHtmlMessage` | Type changed: `'off'\|'warn'` → `boolean` (`'off'` → `false`, `'warn'` → `true`) |
| `escapeParameterHtml` | `escapeParameter` | Renamed |
| `sync` | `inheritLocale` | Renamed |
| `pluralizationRules` | `pluralRules` | Renamed |
| `sharedMessages` | (removed) | Merge into `messages` directly |

**Before (v11):**

```js
const i18n = createI18n({
  legacy: true,
  locale: 'en',
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  formatFallbackMessages: true,
  warnHtmlInMessage: 'off',
  escapeParameterHtml: true,
  sync: false,
  pluralizationRules: { ru: customRule },
  sharedMessages: { en: { shared: 'Shared' } },
  messages: { en: { hello: 'Hello' } }
})
```

**After (v12):**

```js
const i18n = createI18n({
  locale: 'en',
  missingWarn: false,          // silentTranslationWarn: true → missingWarn: false
  fallbackWarn: false,         // silentFallbackWarn: true → fallbackWarn: false
  fallbackFormat: true,        // formatFallbackMessages → fallbackFormat
  warnHtmlMessage: false,      // warnHtmlInMessage: 'off' → warnHtmlMessage: false
  escapeParameter: true,       // escapeParameterHtml → escapeParameter
  inheritLocale: false,        // sync → inheritLocale
  pluralRules: { ru: customRule },  // pluralizationRules → pluralRules
  messages: {
    en: {
      hello: 'Hello',
      shared: 'Shared'          // sharedMessages merged directly into messages
    }
  }
})
```

#### `VueI18n` instance methods

In v11, message management was done via the `VueI18n` instance. In v12, use the equivalent methods on `Composer`:

| VueI18n Method | Composer Method | Change |
|---|---|---|
| `t()` | `t()` | Same |
| `rt()` | `rt()` | Same |
| `te()` | `te()` | Same |
| `tm()` | `tm()` | Same |
| `d()` | `d()` | Same |
| `n()` | `n()` | Same |
| `getLocaleMessage()` | `getLocaleMessage()` | Same |
| `setLocaleMessage()` | `setLocaleMessage()` | Same |
| `mergeLocaleMessage()` | `mergeLocaleMessage()` | Same |
| `getDateTimeFormat()` | `getDateTimeFormat()` | Same |
| `setDateTimeFormat()` | `setDateTimeFormat()` | Same |
| `mergeDateTimeFormat()` | `mergeDateTimeFormat()` | Same |
| `getNumberFormat()` | `getNumberFormat()` | Same |
| `setNumberFormat()` | `setNumberFormat()` | Same |
| `mergeNumberFormat()` | `mergeNumberFormat()` | Same |
| `missing` (property) | `getMissingHandler()` / `setMissingHandler()` | Property → Methods |
| `postTranslation` (property) | `getPostTranslationHandler()` / `setPostTranslationHandler()` | Property → Methods |

**Before (v11):**

```js
// Via i18n instance created by createI18n
i18n.global.locale = 'ja'
i18n.global.setLocaleMessage('fr', { hello: 'Bonjour' })
i18n.global.missing = (locale, key) => { /* ... */ }
```

**After (v12):**

```js
// locale is now a Ref, so .value is required
i18n.global.locale.value = 'ja'
// Methods are available with the same name
i18n.global.setLocaleMessage('fr', { hello: 'Bonjour' })
// missing is now accessed via methods
i18n.global.setMissingHandler((locale, key) => { /* ... */ })
```

#### `i18n.global` changes

In v11 Legacy API, `i18n.global` returned a `VueI18n` instance. In v12, it returns a `Composer` instance.

Key differences:
- `i18n.global.locale` — Changed from `string` to `WritableComputedRef<string>` (`.value` required)
- `i18n.global.fallbackLocale` — Changed to `WritableComputedRef` (`.value` required)
- `i18n.global.messages` — Changed to `ComputedRef` (`.value` required, read-only)
- `i18n.global.availableLocales` — Changed to `ComputedRef` (`.value` required, read-only)


## Drop Custom Directive `v-t`

**Reason**: The `v-t` custom directive was deprecated in v11 with a warning about being dropped in v12. See the [v11 breaking changes](./breaking11.md#deprecate-custom-directive-v-t) for details.

Replace all `v-t` directive usage with `$t()` (global scope) or `t()` from `useI18n()`.

### String syntax

```html
<!-- Before (v11) -->
<p v-t="'hello'"></p>

<!-- After (v12) -->
<p>{{ $t('hello') }}</p>
<!-- or with useI18n() -->
<p>{{ t('hello') }}</p>
```

### Object syntax (named arguments)

```html
<!-- Before (v11) -->
<p v-t="{ path: 'hello', args: { name: userName } }"></p>

<!-- After (v12) -->
<p>{{ $t('hello', { name: userName }) }}</p>
```

### Object syntax (pluralization)

```html
<!-- Before (v11) -->
<p v-t="{ path: 'car', plural: count }"></p>
<!-- or -->
<p v-t="{ path: 'car', choice: count }"></p>

<!-- After (v12) -->
<p>{{ $t('car', count) }}</p>
```

### Object syntax (locale override)

```html
<!-- Before (v11) -->
<p v-t="{ path: 'hello', locale: 'ja' }"></p>

<!-- After (v12) -->
<p>{{ $t('hello', {}, { locale: 'ja' }) }}</p>
<!-- or with useI18n() -->
<p>{{ t('hello', {}, { locale: 'ja' }) }}</p>
```

### Detection with eslint-plugin-vue-i18n

You can use the `@intlify/vue-i18n/no-deprecated-v-t` rule to detect all `v-t` usage in your codebase.

## Default pluralization now uses `Intl.PluralRules`

**Reason**: The previous default pluralization rule was a simple English-only implementation that did not correctly handle languages with complex plural categories (e.g., Russian, Arabic, Polish). Vue I18n v12 now uses `Intl.PluralRules` to automatically select the correct plural form based on the current locale.

### What changed

- When no custom `pluralRules` is set for a locale, Vue I18n automatically uses `Intl.PluralRules` to determine the correct plural category (zero, one, two, few, many, other)
- Message cases must be ordered according to the CLDR plural category order: `zero | one | two | few | many | other` (only include categories that exist for the locale)
- If the number of message cases exceeds the locale's plural category count, Vue I18n falls back to the previous default rule
- If `Intl.PluralRules` is not available in the runtime environment, Vue I18n falls back to the previous default rule

### Migration

If you were relying on the previous default rule for non-English locales **without** custom `pluralRules`, you need to reorder your message cases to match the CLDR plural category order for the locale.

**Before (v11) — Russian with custom `pluralRules`:**

No change needed. Custom `pluralRules` take priority and continue to work as before.

**After (v12) — Russian (automatic, no custom `pluralRules` needed):**

```js
const i18n = createI18n({
  locale: 'ru',
  // No pluralRules needed — Intl.PluralRules handles it automatically
  messages: {
    ru: {
      // Order: one | few | many | other (CLDR order for Russian)
      car: '{n} машина | {n} машины | {n} машин | {n} машин'
    }
  }
})
```

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

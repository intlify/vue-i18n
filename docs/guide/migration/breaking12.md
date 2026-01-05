# Breaking Changes in v12

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

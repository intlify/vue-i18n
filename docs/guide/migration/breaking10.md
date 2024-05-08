# Breaking Changes in v10

:::warning NOTICE
Vue I18n v10 **is still an alpha version**.
:::

## Change `$t` and `t` overloaded signature for Legacy API mode

In Vue I18n v9, it has a different interface from the Composition API mode and Legacy API mode of `$t` and `t` overloaded signature.

Especially, `$t` and `t` signature in Legacy API mode has fewer overloaded signatures than in Composition API mode, as shown below:

| `$t` and `t` overloaded signatures                                                      | Legacy API v9 | Legacy API v10 | Composition API v9 & v10 |
| --------------------------------------------------------------------------------------- | ------------- | -------------- | ------------------------ |
| `$t(key: Key): TranslateResult;`                                                        | ✅            | ✅             | ✅                       |
| `$t(key: Key, locale: Locale): TranslateResult;`                                        | ✅            | -              | -                        |
| `$t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`                       | ✅            | -              | -                        |
| `$t(key: Key, locale: Locale, named: NamedValue): TranslateResult;`                     | ✅            | -              | -                        |
| `$t(key: Key, plural: number): TranslateResult;`                                        | -             | ✅             | ✅                       |
| `$t(key: Key, plural: number, options: TranslateOptions): TranslateResult;`             | -             | ✅             | ✅                       |
| `$t(key: Key, defaultMsg: string): TranslateResult;`                                    | -             | ✅             | ✅                       |
| `$t(key: Key, defaultMsg: string, options: TranslateOptions): TranslateResult;`         | -             | ✅             | ✅                       |
| `$t(key: Key, list: unknown[]): TranslateResult;`                                       | ✅            | ✅             | ✅                       |
| `$t(key: Key, list: unknown[], plural: number): TranslateResult;`                       | -             | ✅             | ✅                       |
| `$t(key: Key, list: unknown[], defaultMsg: string): TranslateResult;`                   | -             | ✅             | ✅                       |
| `$t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;`            | -             | ✅             | ✅                       |
| `$t(key: Key, named: Record<string, unknown>): TranslateResult;`                        | ✅            | ✅             | ✅                       |
| `$t(key: Key, named: NamedValue, plural: number): TranslateResult;`                     | -             | ✅             | ✅                       |
| `$t(key: Key, named: NamedValue, defaultMsg: string): TranslateResult;`                 | -             | ✅             | ✅                       |
| `$t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;`          | -             | ✅             | ✅                       |
| `t(key: Key): TranslateResult;`                                                         | ✅            | ✅             | ✅                       |
| `t(key: Key, locale: Locale): TranslateResult;`                                         | ✅            | -              | -                        |
| `t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`                        | ✅            | -              | -                        |
| `t(key: Key, locale: Locale, named: Record<string, unknown>): TranslateResult;`         | ✅            | -              | -                        |
| `t(key: Key, plural: number): TranslateResult; `                                        | -             | ✅             | ✅                       |
| `t(key: Key, plural: number, options: TranslateOptions<Locales>): TranslateResult; `    | -             | ✅             | ✅                       |
| `t(key: Key, defaultMsg: string): TranslateResult;`                                     | -             | ✅             | ✅                       |
| `t(key: Key, defaultMsg: string, options: TranslateOptions<Locales>): TranslateResult;` | -             | ✅             | ✅                       |
| `t(key: Key, list: unknown[]): TranslateResult;`                                        | ✅            | ✅             | ✅                       |
| `t(key: Key, list: unknown[], plural: number): TranslateResult;`                        | -             | ✅             | ✅                       |
| `t(key: Key, list: unknown[], defaultMsg: string): TranslateResult;`                    | -             | ✅             | ✅                       |
| `t(key: Key, list: unknown[], options: TranslateOptions<Locales>): TranslateResult;`    | -             | ✅             | ✅                       |
| `t(key: Key, named: Record<string, unknown>): TranslateResult;`                         | ✅            | ✅             | ✅                       |
| `t(key: Key, named: NamedValue, plural: number): TranslateResult;`                      | -             | ✅             | ✅                       |
| `t(key: Key, named: NamedValue, defaultMsg: string): TranslateResult;`                  | -             | ✅             | ✅                       |
| `t(key: Key, named: NamedValue, options: TranslateOptions<Locales>): TranslateResult;`  | -             | ✅             | ✅                       |

Starting from v10, Legacy API mode can use the same `$t` and `t` overload signature as Composition API mode.

**Reason**: After that migration, when migrating to Composition API mode, we sometimes fall into a pitfall due to the different signature.

If you are using the following APIs in Legacy API mode, you must change to another signature because of the breaking changes:

- `$t(key: Key, locale: Locale): TranslateResult;`
- `$t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`
- `$t(key: Key, locale: Locale, named: NamedValue): TranslateResult;`
- `t(key: Key, locale: Locale): TranslateResult;`
- `t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`
- `t(key: Key, locale: Locale, named: NamedValue): TranslateResult;`

### `$t(key: Key, locale: Locale): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $t('message.hello', 'ja') }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;` or `$t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;`

```vue
<template>
  <p>{{ $t('message.hello', {}, { locale: 'ja' }) }}</p>
</template>
```

### `$t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $t('message.hello', 'ja', ['dio']) }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;`

```vue
<template>
  <p>{{ $t('message.hello', ['dio'], { locale: 'ja' }) }}</p>
</template>
```

### `$t(key: Key, locale: Locale, named: NamedValue): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $t('message.hello', 'ja', { name: 'dio' }) }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;`

```vue
<template>
  <p>{{ $t('message.hello', { name: 'dio' }, { locale: 'ja' }) }}</p>
</template>
```

### `t(key: Key, locale: Locale): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})

console.log(i18n.global.t('message.hello', 'ja'))
```

Vue I18n v10 or later:

use `t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;` or `t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})

console.log(i18n.global.t('message.hello', {}, { locale: 'ja' })
```

### `t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})

console.log(i18n.global.t('message.hello', 'ja', ['dio']))
```

Vue I18n v10 or later:

use `t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})

console.log(i18n.global.t('message.hello', ['dio'], { locale: 'ja' }))
```

### `t(key: Key, locale: Locale, named: NamedValue): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})

console.log(i18n.global.t('message.hello', 'ja', { name: 'dio' }))
```

Vue I18n v10 or later:

use `t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})

console.log(i18n.global.t('message.hello', { name: 'dio' }, { locale: 'ja' }))
```

## Deprecate `tc` and `$tc` for Legacy API mode

The following APIs are deprecated in v10:

- `tc(key: Key | ResourceKeys): TranslateResult;`
- `tc(key: Key | ResourceKeys, locale: Locales | Locale): TranslateResult;`
- `tc(key: Key | ResourceKeys, list: unknown[]): TranslateResult;`
- `tc(key: Key | ResourceKeys, named: Record<string, unknown>): TranslateResult;`
- `tc(key: Key | ResourceKeys, choice: number): TranslateResult;`
- `tc(key: Key | ResourceKeys, choice: number, locale: Locales | Locale): TranslateResult;`
- `tc(key: Key | ResourceKeys, choice: number, list: unknown[]): TranslateResult;`
- `tc(key: Key | ResourceKeys, choice: number, named: Record<string, unknown>): TranslateResult;`
- `$tc(key: Key): TranslateResult;`
- `$tc(key: Key, locale: Locale): TranslateResult;`
- `$tc(key: Key, list: unknown[]): TranslateResult;`
- `$tc(key: Key, named: Record<string, unknown>): TranslateResult;`
- `$tc(key: Key, choice: number): TranslateResult;`
- `$tc(key: Key, choice: number, locale: Locale): TranslateResult;`
- `$tc(key: Key, choice: number, list: unknown[]): TranslateResult;`
- `$tc(key: Key, choice: number, named: Record<string, unknown>): TranslateResult;`

**Reason**: Legacy API mode has `t` and `$t` support plural interfaces, so they can be replaced.

In v10, `tc` and `$tc` still exist to give benefit migration. These will be dropped completely in v11.

If you will use them, Vue I18n will output the console warning in your application.


### `tc(key: Key | ResourceKeys): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.tc('banana'))
```

Vue I18n v10 or later:

use `t(key: Key | ResourceKeys, plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.t('banana', 1))
```

### `tc(key: Key | ResourceKeys, locale: Locales | Locale): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.tc('banana', 'ja'))
```

Vue I18n v10 or later:

use `t(key: Key | ResourceKeys, plural: number, options: TranslateOptions<Locales>): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.t('banana', 1, { locale: 'ja' }))
```

### `tc(key: Key | ResourceKeys, list: unknown[]): TranslateResult;`


Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.tc('banana', ['dio']))
```

Vue I18n v10 or later:

use `t(key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.t('banana', ['dio'], 1))
```

### `tc(key: Key | ResourceKeys, named: Record<string, unknown>): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.tc('banana', { name: 'dio' }))
```

Vue I18n v10 or later:

use `t(key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.t('banana', { name: 'dio' }, 1))
```

### `tc(key: Key | ResourceKeys, choice: number): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.tc('banana', 2))
```

Vue I18n v10 or later:

use `t(key: Key | ResourceKeys, plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.t('banana', 2))
```

### `tc(key: Key | ResourceKeys, choice: number, locale: Locales | Locale): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.tc('banana', 2, 'ja'))
```

Vue I18n v10 or later:

use `t(key: Key | ResourceKeys, plural: number, options: TranslateOptions<Locales>): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.t('banana', 2, { locale: 'ja' }))
```

### `tc(key: Key | ResourceKeys, choice: number, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.t('banana', 2, ['dio']))
```

Vue I18n v10 or later:

use `t(key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.t('banana', ['dio'], 2))
```

### `tc(key: Key | ResourceKeys, choice: number, named: Record<string, unknown>): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.tc('banana', 2, { name: 'dio' }))
```

Vue I18n v10 or later:

use `t(key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // something options ...
})
console.log(i18n.global.tc('banana', { name: 'dio' }, 2))
```

### `$tc(key: Key): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana') }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, plural: number): TranslateResult;`

```vue
<template>
  <p>{{ $t('banana', 1) }}</p>
</template>
```

### `$tc(key: Key, locale: Locale): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana', 'ja') }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, plural: number, options: TranslateOptions): TranslateResult;`

```vue
<template>
  <p>{{ $t('banana', 1, { locale: 'ja' }) }}</p>
</template>
```

### `$tc(key: Key, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana', ['dio']) }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, list: unknown[], plural: number): TranslateResult;`

```vue
<template>
  <p>{{ $t('banana', ['dio'], 1) }}</p>
</template>
```

### `$tc(key: Key, named: Record<string, unknown>): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana', { name: 'dio' }) }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, named: NamedValue, plural: number): TranslateResult;`

```vue
<template>
  <p>{{ $t('banana', { name: 'dio' }, 1) }}</p>
</template>
```

### `$tc(key: Key, choice: number): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana', 2) }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, plural: number): TranslateResult;`

```vue
<template>
  <p>{{ $t('banana', 2) }}</p>
</template>
```

### `$tc(key: Key, choice: number, locale: Locale): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana', 2, 'ja') }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, plural: number, options: TranslateOptions): TranslateResult;`

```vue
<template>
  <p>{{ $t('banana', 2, { locale: 'ja' }) }}</p>
</template>
```

### `$tc(key: Key, choice: number, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana', 2, ['dio']) }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, list: unknown[], plural: number): TranslateResult;`

```vue
<template>
  <p>{{ $t('banana', ['dio'], 2) }}</p>
</template>
```

### `$tc(key: Key, choice: number, named: Record<string, unknown>): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana', 2,  { name: 'dio' }) }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Key, named: NamedValue, plural: number): TranslateResult;`

```vue
<template>
  <p>{{ $t('banana', { name: 'dio' }, 2) }}</p>
</template>
```

## Drop modulo `%` syntax

Named interpolation using modulo `%` is no longer supported in v10.

**Reason**: module syntax has already deprecated in v9 with a warning.

### for migration

You can use `eslint-plugin-vue-i18n`.

`eslint-plugin-vue-i18n` has `@intlify/vue-i18n/no-deprecated-modulo-syntax` rule.
https://eslint-plugin-vue-i18n.intlify.dev/rules/no-deprecated-modulo-syntax.html

You can fixed with using `eslint --fix`

You must have migrated with eslint before upgrading to vue-i18n v10

## Drop `vue-i18n-bridge`

**Reason**: vue-i18n-bridge is a bridge library for migrating vue-i18n from Vue 2 to Vue 3, and Vue 2 is no longer past EOL.

## Drop `allowComposition` option

**Reason**: This option already deprecated in warning about being dropped in v10. docs says, https://vue-i18n.intlify.dev/guide/migration/vue3.html#about-supporting

This option was added to support the migration from the Legacy API to the composition API on v9.

## Drop `formatter` option on Legacy API

**Reason**: This option was deprecated in warning on v9.

## Drop `preserveDirectiveContent` option on Legacy API

**Reason**: This option was deprecated in warning on v9.

## Drop `preserve` modifier codes on `v-t` directive

**Reason**: This option was deprecated in warning on v9.

## Drop `getChoiceIndex` on Legacy API

**Reason**: This option was deprecated in warning on v9.

## Drop translation component `<i18n>` v8.x compatibility

**Reason**: This option was deprecated in warning on v9.

## Drop `te` behavior v8.x compatibility

**Reason**: This option was deprecated in warning on v9.

This option was introduced in this issue for supporting te behavior v8.x compatibility on v9

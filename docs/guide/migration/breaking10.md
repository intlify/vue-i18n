# Breaking Changes in v10

:::warning NOTICE
Vue I18n v10 **is still an alpha version**.
:::

## APIs

### Change `$t` and `t` overloaded signature for Legacy API mode

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

#### `$t(key: Key, locale: Locale): TranslateResult;`

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

#### `$t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`

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

#### `$t(key: Key, locale: Locale, named: NamedValue): TranslateResult;`

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

#### `t(key: Key, locale: Locale): TranslateResult;`

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

#### `t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`

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

#### `t(key: Key, locale: Locale, named: NamedValue): TranslateResult;`

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

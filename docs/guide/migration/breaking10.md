# Breaking Changes in v10

:::warning NOTICE
Vue I18n v10 **is still an alpha version**.
:::

## APIs

### Change `$t` overloaded signature for Legacy API mode

In Vue I18n v9, it has a different interface from the Composition API mode and Legacy API mode of the `$t` overloaded signature.

Especially, `$t` signature in Legacy API mode has fewer overloaded signatures than in Composition API mode, as shown below:

| `$t` overloaded signatures                                                       | Legacy API v9 | Legacy API v10 | Composition API v9 & v10 |
| -------------------------------------------------------------------------------- | ------------- | -------------- | ------------------------ |
| `$t(key: Path): TranslateResult;`                                                | ✅            | ✅             | ✅                       |
| `$t(key: Path, locale: Locale): TranslateResult;`                                | ✅            | -              | -                        |
| `$t(key: Path, locale: Locale, list: unknown[]): TranslateResult;`               | ✅            | -              | -                        |
| `$t(key: Path, locale: Locale, named: NamedValue): TranslateResult;`             | ✅            | -              | -                        |
| `$t(key: Path, plural: number): TranslateResult;`                                | -             | ✅             | ✅                       |
| `$t(key: Path, plural: number, options: TranslateOptions): TranslateResult;`     | -             | ✅             | ✅                       |
| `$t(key: Path, defaultMsg: string): TranslateResult;`                            | -             | ✅             | ✅                       |
| `$t(key: Path, defaultMsg: string, options: TranslateOptions): TranslateResult;` | -             | ✅             | ✅                       |
| `$t(key: Path, list: unknown[]): TranslateResult;`                               | ✅            | ✅             | ✅                       |
| `$t(key: Path, list: unknown[], plural: number): TranslateResult;`               | -             | ✅             | ✅                       |
| `$t(key: Path, list: unknown[], defaultMsg: string): TranslateResult;`           | -             | ✅             | ✅                       |
| `$t(key: Path, list: unknown[], options: TranslateOptions): TranslateResult;`    | -             | ✅             | ✅                       |
| `$t(key: Path, named: Record<string, unknown>): TranslateResult;`                | ✅            | ✅             | ✅                       |
| `$t(key: Path, named: NamedValue, plural: number): TranslateResult;`             | -             | ✅             | ✅                       |
| `$t(key: Path, named: NamedValue, defaultMsg: string): TranslateResult;`         | -             | ✅             | ✅                       |
| `$t(key: Path, named: NamedValue, options: TranslateOptions): TranslateResult;`  | -             | ✅             | ✅                       |

Starting from v10, Legacy API mode can use the same `$t` overload signature as Composition API mode.

**Reason**: After that migration, when migrating to Composition API mode, we sometimes fall into a pitfall due to the different signature of `$t`.

If you are using the following APIs in Legacy API mode, you must change to another signature because of the breaking changes:

- `$t(key: Path, locale: Locale): TranslateResult;`
- `$t(key: Path, locale: Locale, list: unknown[]): TranslateResult;`
- `$t(key: Path, locale: Locale, named: NamedValue): TranslateResult;`

#### `$t(key: Path, locale: Locale): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $t('message.hello', 'ja') }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Path, list: unknown[], options: TranslateOptions): TranslateResult;` or `$t(key: Path, named: NamedValue, options: TranslateOptions): TranslateResult;`

```vue
<template>
  <p>{{ $t('message.hello', {}, { locale: 'ja' }) }}</p>
</template>
```

#### `$t(key: Path, locale: Locale, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $t('message.hello', 'ja', ['dio']) }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Path, list: unknown[], options: TranslateOptions): TranslateResult;`

```vue
<template>
  <p>{{ $t('message.hello', ['dio'], { locale: 'ja' }) }}</p>
</template>
```

#### `$t(key: Path, locale: Locale, named: NamedValue): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $t('message.hello', 'ja', { name: 'dio' }) }}</p>
</template>
```

Vue I18n v10 or later:

use `$t(key: Path, named: NamedValue, options: TranslateOptions): TranslateResult;`

```vue
<template>
  <p>{{ $t('message.hello', { name: 'dio' }, { locale: 'ja' }) }}</p>
</template>
```

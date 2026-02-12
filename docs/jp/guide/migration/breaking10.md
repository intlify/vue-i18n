# v10 破壊的変更

## JIT コンパイルのデフォルト有効化

**理由**: CSP の問題を解決し、動的リソースをサポートできるため。

JIT コンパイルは v9.3 で導入されました。デフォルトでは有効になっていませんでした。

vue-i18n を統合している Nuxt I18n では、すでにこの機能がデフォルトで有効になっており、安定しています。
https://i18n.nuxtjs.org/docs/options/compilation#jit

Vue I18n でこの機能を使用するには、バンドラーと `@intlify/unplugin-vue-i18n` を使用して `__INTLIFY_JIT_COMPILATION__` フラグを有効にする必要がありました。
v10 以降、JIT コンパイルではデフォルトでこのフラグは不要になりました。

JIT コンパイルを使用せず、v10 以降に移行する場合は、**アプリケーションを一度再ビルドする必要があります**。

JIT コンパイルの詳細については、「[最適化](../advanced/optimization.md)」を参照してください。

## Legacy API モードの `$t` と `t` のオーバーロードシグネチャの変更

Vue I18n v9 では、`$t` と `t` のオーバーロードシグネチャのインターフェースが Composition API モードと Legacy API モードで異なっていました。

特に、Legacy API モードの `$t` と `t` のシグネチャは、以下に示すように Composition API モードよりもオーバーロードシグネチャが少なくなっています。

| `$t` および `t` のオーバーロードシグネチャ                                                      | Legacy API v9 | Legacy API v10 | Composition API v9 & v10 |
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

v10 以降、Legacy API モードでは、Composition API モードと同じ `$t` および `t` のオーバーロードシグネチャを使用できます。

**理由**: 移行後、Composition API モードに移行する際に、シグネチャが異なるために落とし穴にはまることがあるため。

Legacy API モードで以下の API を使用している場合は、破壊的変更のため、別のシグネチャに変更する必要があります。

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

Vue I18n v10 以降:

`$t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;` または `$t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;` を使用してください

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

Vue I18n v10 以降:

`$t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;` を使用してください

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

Vue I18n v10 以降:

`$t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;` を使用してください

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
  // その他のオプション ...
})

console.log(i18n.global.t('message.hello', 'ja'))
```

Vue I18n v10 以降:

`t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;` または `t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})

console.log(i18n.global.t('message.hello', {}, { locale: 'ja' }))
```

### `t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})

console.log(i18n.global.t('message.hello', 'ja', ['dio']))
```

Vue I18n v10 以降:

`t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})

console.log(i18n.global.t('message.hello', ['dio'], { locale: 'ja' }))
```

### `t(key: Key, locale: Locale, named: NamedValue): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})

console.log(i18n.global.t('message.hello', 'ja', { name: 'dio' }))
```

Vue I18n v10 以降:

`t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})

console.log(i18n.global.t('message.hello', { name: 'dio' }, { locale: 'ja' }))
```

## Legacy API モードの `tc` と `$tc` の非推奨化

以下の API は v10 で非推奨になります。

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

**理由**: Legacy API モードには複数形インターフェースをサポートする `t` と `$t` があるため、それらに置き換えることができます。

v10 では、移行を容易にするために `tc` と `$tc` はまだ存在します。これらは v11 で完全に削除されます。

これらを使用すると、Vue I18n はアプリケーションでコンソール警告を出力します。

### `tc(key: Key | ResourceKeys): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.tc('banana'))
```

Vue I18n v10 以降:

`t(key: Key | ResourceKeys, plural: number): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.t('banana', 1))
```

### `tc(key: Key | ResourceKeys, locale: Locales | Locale): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.tc('banana', 'ja'))
```

Vue I18n v10 以降:

`t(key: Key | ResourceKeys, plural: number, options: TranslateOptions<Locales>): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.t('banana', 1, { locale: 'ja' }))
```

### `tc(key: Key | ResourceKeys, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.tc('banana', ['dio']))
```

Vue I18n v10 以降:

`t(key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.t('banana', ['dio'], 1))
```

### `tc(key: Key | ResourceKeys, named: Record<string, unknown>): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.tc('banana', { name: 'dio' }))
```

Vue I18n v10 以降:

`t(key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.t('banana', { name: 'dio' }, 1))
```

### `tc(key: Key | ResourceKeys, choice: number): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.tc('banana', 2))
```

Vue I18n v10 以降:

`t(key: Key | ResourceKeys, plural: number): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.t('banana', 2))
```

### `tc(key: Key | ResourceKeys, choice: number, locale: Locales | Locale): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.tc('banana', 2, 'ja'))
```

Vue I18n v10 以降:

`t(key: Key | ResourceKeys, plural: number, options: TranslateOptions<Locales>): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.t('banana', 2, { locale: 'ja' }))
```

### `tc(key: Key | ResourceKeys, choice: number, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.tc('banana', 2, ['dio']))
```

Vue I18n v10 以降:

`t(key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.t('banana', ['dio'], 2))
```

### `tc(key: Key | ResourceKeys, choice: number, named: Record<string, unknown>): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.tc('banana', 2, { name: 'dio' }))
```

Vue I18n v10 以降:

`t(key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;` を使用してください

```ts
const i18n = createI18n({
  legacy: true,
  // その他のオプション ...
})
console.log(i18n.global.t('banana', { name: 'dio' }, 2))
```

### `$tc(key: Key): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana') }}</p>
</template>
```

Vue I18n v10 以降:

`$t(key: Key, plural: number): TranslateResult;` を使用してください

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

Vue I18n v10 以降:

`$t(key: Key, plural: number, options: TranslateOptions): TranslateResult;` を使用してください

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

Vue I18n v10 以降:

`$t(key: Key, list: unknown[], plural: number): TranslateResult;` を使用してください

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

Vue I18n v10 以降:

`$t(key: Key, named: NamedValue, plural: number): TranslateResult;` を使用してください

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

Vue I18n v10 以降:

`$t(key: Key, plural: number): TranslateResult;` を使用してください

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

Vue I18n v10 以降:

`$t(key: Key, plural: number, options: TranslateOptions): TranslateResult;` を使用してください

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

Vue I18n v10 以降:

`$t(key: Key, list: unknown[], plural: number): TranslateResult;` を使用してください

```vue
<template>
  <p>{{ $t('banana', ['dio'], 2) }}</p>
</template>
```

### `$tc(key: Key, choice: number, named: Record<string, unknown>): TranslateResult;`

Vue I18n v9.x:

```vue
<template>
  <p>{{ $tc('banana', 2, { name: 'dio' }) }}</p>
</template>
```

Vue I18n v10 以降:

`$t(key: Key, named: NamedValue, plural: number): TranslateResult;` を使用してください

```vue
<template>
  <p>{{ $t('banana', { name: 'dio' }, 2) }}</p>
</template>
```

## 剰余 `%` 構文の廃止

剰余 `%` を使用した名前付き補間は v10 でサポートされなくなりました。

**理由**: モジュール構文は v9 で警告付きで非推奨になりました。

### 移行

`eslint-plugin-vue-i18n` を使用できます。

`eslint-plugin-vue-i18n` には `@intlify/vue-i18n/no-deprecated-modulo-syntax` ルールがあります。
https://eslint-plugin-vue-i18n.intlify.dev/rules/no-deprecated-modulo-syntax.html

`eslint --fix` を使用して修正できます

vue-i18n v10 にアップグレードする前に、eslint を使用して移行する必要があります

## `vue-i18n-bridge` の廃止

**理由**: vue-i18n-bridge は vue-i18n を Vue 2 から Vue 3 に移行するためのブリッジライブラリであり、Vue 2 はすでに EOL を過ぎています。

## `allowComposition` オプションの廃止

**理由**: このオプションはすでに非推奨であり、v10 で削除されるという警告が表示されています。ドキュメントには次のように記載されています: https://vue-i18n.intlify.dev/guide/migration/vue3.html#about-supporting

このオプションは、v9 で Legacy API から Composition API への移行をサポートするために追加されました。

## Legacy API の `formatter` オプションの廃止

**理由**: このオプションは v9 で警告付きで非推奨になりました。

## Legacy API の `preserveDirectiveContent` オプションの廃止

**理由**: このオプションは v9 で警告付きで非推奨になりました。

## `v-t` ディレクティブの `preserve` 修飾子コードの廃止

**理由**: このオプションは v9 で警告付きで非推奨になりました。

## Legacy API の `getChoiceIndex` の廃止

**理由**: このオプションは v9 で警告付きで非推奨になりました。

## 翻訳コンポーネント `<i18n>` v8.x 互換性の廃止

**理由**: このオプションは v9 で警告付きで非推奨になりました。

## `te` 動作 v8.x 互換性の廃止

**理由**: このオプションは v9 で警告付きで非推奨になりました。

このオプションは、v9 での te 動作 v8.x 互換性をサポートするためにこの問題で導入されました

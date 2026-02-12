# v10 重大变更

## 默认启用 JIT 编译

**原因**: 可以解决 CSP 问题并支持动态资源。

JIT 编译是在 v9.3 中引入的。当时默认不启用。

集成了 vue-i18n 的 Nuxt I18n 已经默认启用并稳定支持此功能。
https://i18n.nuxtjs.org/docs/options/compilation#jit

要在 Vue I18n 中使用此功能，我们必须使用打包器和 `@intlify/unplugin-vue-i18n` 来启用 `__INTLIFY_JIT_COMPILATION__` 标志。
从 v10 开始，JIT 编译默认不需要此标志。

如果你仍不使用 JIT 编译并要升级到 v10 或更高版本，**你需要重新构建一次应用程序**。

关于 JIT 编译的详细信息，请参阅“[优化](../advanced/optimization.md)”。

## 更改传统 API 模式的 `$t` 和 `t` 重载签名

在 Vue I18n v9 中，`$t` 和 `t` 重载签名的组合式 API 模式和传统 API 模式具有不同的接口。

特别是，传统 API 模式下的 `$t` 和 `t` 签名比组合式 API 模式下的重载签名少，如下所示：

| `$t` 和 `t` 重载签名                                                      | 传统 API v9 | 传统 API v10 | 组合式 API v9 & v10 |
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

从 v10 开始，传统 API 模式可以使用与组合式 API 模式相同的 `$t` 和 `t` 重载签名。

**原因**: 在迁移后，当迁移到组合式 API 模式时，由于签名不同，我们有时会陷入陷阱。

如果你在传统 API 模式下使用以下 API，由于重大变更，你必须更改为其他签名：

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;` 或 `$t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;`

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;`

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;`

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
  // 其他选项 ...
})

console.log(i18n.global.t('message.hello', 'ja'))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;` 或 `t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})

console.log(i18n.global.t('message.hello', {}, { locale: 'ja' }))
```

### `t(key: Key, locale: Locale, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})

console.log(i18n.global.t('message.hello', 'ja', ['dio']))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})

console.log(i18n.global.t('message.hello', ['dio'], { locale: 'ja' }))
```

### `t(key: Key, locale: Locale, named: NamedValue): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})

console.log(i18n.global.t('message.hello', 'ja', { name: 'dio' }))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})

console.log(i18n.global.t('message.hello', { name: 'dio' }, { locale: 'ja' }))
```

## 弃用传统 API 模式的 `tc` 和 `$tc`

v10 中弃用了以下 API：

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

**原因**: 传统 API 模式具有支持复数接口的 `t` 和 `$t`，因此可以替换它们。

在 v10 中，`tc` 和 `$tc` 仍然存在以方便迁移。这些将在 v11 中完全删除。

如果你使用它们，Vue I18n 将在你的应用程序中输出控制台警告。

### `tc(key: Key | ResourceKeys): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.tc('banana'))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key | ResourceKeys, plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.t('banana', 1))
```

### `tc(key: Key | ResourceKeys, locale: Locales | Locale): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.tc('banana', 'ja'))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key | ResourceKeys, plural: number, options: TranslateOptions<Locales>): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.t('banana', 1, { locale: 'ja' }))
```

### `tc(key: Key | ResourceKeys, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.tc('banana', ['dio']))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.t('banana', ['dio'], 1))
```

### `tc(key: Key | ResourceKeys, named: Record<string, unknown>): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.tc('banana', { name: 'dio' }))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.t('banana', { name: 'dio' }, 1))
```

### `tc(key: Key | ResourceKeys, choice: number): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.tc('banana', 2))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key | ResourceKeys, plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.t('banana', 2))
```

### `tc(key: Key | ResourceKeys, choice: number, locale: Locales | Locale): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.tc('banana', 2, 'ja'))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key | ResourceKeys, plural: number, options: TranslateOptions<Locales>): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.t('banana', 2, { locale: 'ja' }))
```

### `tc(key: Key | ResourceKeys, choice: number, list: unknown[]): TranslateResult;`

Vue I18n v9.x:

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.tc('banana', 2, ['dio']))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.t('banana', ['dio'], 2))
```

### `tc(key: Key | ResourceKeys, choice: number, named: Record<string, unknown>): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
})
console.log(i18n.global.tc('banana', 2, { name: 'dio' }))
```

Vue I18n v10 或更高版本:

使用 `t(key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;`

```ts
const i18n = createI18n({
  legacy: true,
  // 其他选项 ...
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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, plural: number): TranslateResult;`

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, plural: number, options: TranslateOptions): TranslateResult;`

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, list: unknown[], plural: number): TranslateResult;`

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, named: NamedValue, plural: number): TranslateResult;`

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, plural: number): TranslateResult;`

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, plural: number, options: TranslateOptions): TranslateResult;`

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, list: unknown[], plural: number): TranslateResult;`

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

Vue I18n v10 或更高版本:

使用 `$t(key: Key, named: NamedValue, plural: number): TranslateResult;`

```vue
<template>
  <p>{{ $t('banana', { name: 'dio' }, 2) }}</p>
</template>
```

## 放弃模组 `%` 语法

v10 中不再支持使用模组 `%` 的命名插值。

**原因**: 模组语法已在 v9 中弃用并带有警告。

### 迁移

你可以使用 `eslint-plugin-vue-i18n`。

`eslint-plugin-vue-i18n` 具有 `@intlify/vue-i18n/no-deprecated-modulo-syntax` 规则。
https://eslint-plugin-vue-i18n.intlify.dev/rules/no-deprecated-modulo-syntax.html

你可以使用 `eslint --fix` 进行修复

在升级到 vue-i18n v10 之前，你必须使用 eslint 进行迁移

## 放弃 `vue-i18n-bridge`

**原因**: vue-i18n-bridge 是用于将 vue-i18n 从 Vue 2 迁移到 Vue 3 的桥接库，而 Vue 2 已过 EOL。

## 放弃 `allowComposition` 选项

**原因**: 此选项已弃用并警告将在 v10 中删除。文档说明：https://vue-i18n.intlify.dev/guide/migration/vue3.html#about-supporting

添加此选项是为了支持在 v9 上从传统 API 迁移到组合式 API。

## 放弃传统 API 上的 `formatter` 选项

**原因**: 此选项已在 v9 中弃用并带有警告。

## 放弃传统 API 上的 `preserveDirectiveContent` 选项

**原因**: 此选项已在 v9 中弃用并带有警告。

## 放弃 `v-t` 指令上的 `preserve` 修饰符代码

**原因**: 此选项已在 v9 中弃用并带有警告。

## 放弃传统 API 上的 `getChoiceIndex`

**原因**: 此选项已在 v9 中弃用并带有警告。

## 放弃翻译组件 `<i18n>` v8.x 兼容性

**原因**: 此选项已在 v9 中弃用并带有警告。

## 放弃 `te` 行为 v8.x 兼容性

**原因**: 此选项已在 v9 中弃用并带有警告。

此选项是在此问题中引入的，用于支持 v9 上的 te 行为 v8.x 兼容性

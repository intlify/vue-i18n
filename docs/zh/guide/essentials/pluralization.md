# 复数形式

为了本地化消息，你可能需要支持某些语言的复数形式。

Vue I18n 支持复数形式，你可以使用具有复数特性的翻译 API。

## 基本用法

你需要定义包含管道符 `|` 分隔符的语言环境消息，并在管道符分隔符中定义复数。

语言环境消息如下：

```js
const messages = {
  en: {
    car: 'car | cars',
    apple: 'no apples | one apple | {count} apples'
  }
}
```

在这里，我们有一个 `en` 语言环境对象，包含 `car` 和 `apple`。

`car` 具有 `car | cars` 复数消息，而 `apple` 具有 `no apples | one apple | {count} apples` 复数消息。

这些复数消息是根据你在翻译 API 中指定的数值，通过翻译 API 中每种语言的选择规则逻辑来选择的。

Vue I18n 提供了一些支持复数形式的方法。这里我们将使用 `$t`。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!TIP]
> `$t` 有一些重载。关于这些重载，请参阅 [API 参考](../../../api/vue/interfaces/ComponentCustomProperties.md#t)

> [!NOTE]
> 支持复数形式的一些方法包括：
>
> - 注入的全局 `$t`
> - 内置翻译组件 (`i18n-t`)
> - 从 `useI18n` 导出的 `t` (用于组合式 API 模式)

<!-- eslint-enable markdown/no-missing-label-refs -->

以下是使用翻译 API 的示例。

```html
<p>{{ $t('car', 1) }}</p>
<p>{{ $t('car', 2) }}</p>

<p>{{ $t('apple', 0) }}</p>
<p>{{ $t('apple', 1) }}</p>
<p>{{ $t('apple', 10, { count: 10 }) }}</p>
```

在上述使用 `$t` 的示例中，第一个参数是语言环境消息键，第二个参数是数字。`$t` 返回选择的消息作为结果。

结果如下：

```html
<p>car</p>
<p>cars</p>

<p>no apples</p>
<p>one apple</p>
<p>10 apples</p>
```

## 预定义的隐式参数

你不需要显式给出复数形式的数字。

让我们看一个例子来理解这意味着什么！

语言环境消息如下：

```js
const messages = {
  en: {
    apple: 'no apples | one apple | {count} apples',
    banana: 'no bananas | {n} banana | {n} bananas'
  }
}
```

在这里，我们有一个 `en` 语言环境对象，包含 `apple` 和 `banana`。

`apple` 具有 `no apples | one apple | {count} apples` 复数消息，`banana` 具有 `no bananas | {n} banana | {n} bananas` 复数消息。

可以通过预定义的命名参数 `{count}` 和/或 `{n}` 在语言环境消息中访问该数字。如果需要，你可以覆盖这些预定义的命名参数。

以下是使用 `$t` 的示例：

```html
<p>{{ $t('apple', 10, { named: { count: 10 } }) }}</p>
<p>{{ $t('apple', 10) }}</p>

<p>{{ $t('banana', 1, { named: { n: 1 } }) }}</p>
<p>{{ $t('banana', 1) }}</p>
<p>{{ $t('banana', 100, { named: { n: 'too many' } }) }}</p>
```

在上面的一些示例中，第一个参数是语言环境消息键，第二个参数是数值或对象。

如果指定了对象，它等同于具名插值。你可以通过给出参数来插值复数消息中隐式的 `n` 或 `count`。

结果如下：

```html
<p>10 apples</p>
<p>10 apples</p>

<p>1 banana</p>
<p>1 banana</p>
<p>too many bananas</p>
```

## 自定义复数形式

然而，这种复数形式并不适用于所有语言（例如，斯拉夫语言有不同的复数规则）。

要实现这些规则，你可以将可选的 `pluralRules` 对象传递给 `createI18n` 选项。

使用斯拉夫语言（俄语、乌克兰语等）规则的非常简化的示例：

```js
function customRule(choice, choicesLength, orgRule) {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}
```

要使用上面定义的自定义规则，在 `createI18n` 内部设置 `pluralRules`，如下所示：

```js
const i18n = createI18n({
  locale: 'ru',
  pluralRules: {
    ru: customRule
  },
  messages: {
    ru: {
      car: '0 машин | {n} машина | {n} машины | {n} машин',
      banana: 'нет бананов | {n} банан | {n} банана | {n} бананов'
    }
  }
})
```

使用以下模板：

```html
<h2>Car:</h2>
<p>{{ $t('car', 1) }}</p>
<p>{{ $t('car', 2) }}</p>
<p>{{ $t('car', 4) }}</p>
<p>{{ $t('car', 12) }}</p>
<p>{{ $t('car', 21) }}</p>

<h2>Banana:</h2>
<p>{{ $t('banana', 0) }}</p>
<p>{{ $t('banana', 4) }}</p>
<p>{{ $t('banana', 11) }}</p>
<p>{{ $t('banana', 31) }}</p>
```

结果如下：

```html
<h2>Car:</h2>
<p>1 машина</p>
<p>2 машины</p>
<p>4 машины</p>
<p>12 машин</p>
<p>21 машина</p>

<h2>Banana:</h2>
<p>нет бананов</p>
<p>4 банана</p>
<p>11 бананов</p>
<p>31 банан</p>
```

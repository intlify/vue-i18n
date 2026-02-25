# Pluralization

To localize the message, you might need to support the pluralization for some languages.

Vue i18n support pluralization, you can be able to use translation API that has pluralization feature.

## Basic Usage

You need to define the locale messages that have a pipe `|` separator and define plurals in pipe separator.

Locale messages the below:

```js
const messages = {
  en: {
    car: 'car | cars',
    apple: 'no apples | one apple | {count} apples'
  }
}
```

Here, we have an `en` locale object that has `car` and `apple`.

The `car` has `car | cars` pluralization message, while the `apple` has `no apples | one apple | {count} apples` pluralization message.

These plural messages are selected by the logic of the choice rule for each language in the translation API according to the numeric value you specify at the translation API.

Vue I18n offers some ways to support pluralization. Here we’ll use the `$t`.

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!TIP]
> `$t` has some overloads. About these overloads, see the [API Reference](../../api/vue/interfaces/ComponentCustomProperties.md#t)

> [!NOTE]
> Some ways to support pluralization are:
>
> - injected global `$t`
> - built-in Translation component (`i18n-t`)
> - exported `t` from `useI18n` (for Composition API mode)

<!-- eslint-enable markdown/no-missing-label-refs -->

The following is an example of using the translation API.

```html
<p>{{ $t('car', 1) }}</p>
<p>{{ $t('car', 2) }}</p>

<p>{{ $t('apple', 0) }}</p>
<p>{{ $t('apple', 1) }}</p>
<p>{{ $t('apple', { count: 10 }) }}</p>
```

In the above example of using the `$t`, the first argument is the locale messages key and the second argument is a number. The `$t` returns the choice message as a result.

As result the below:

```html
<p>car</p>
<p>cars</p>

<p>no apples</p>
<p>one apple</p>
<p>10 apples</p>
```

## Predefined implicit arguments

You don’t need to explicitly give the number for pluralization.

Let’s look at an example to understand what that means!

Locale messages the below:

```js
const messages = {
  en: {
    apple: 'no apples | one apple | {count} apples',
    banana: 'no bananas | {n} banana | {n} bananas'
  }
}
```

Here, we have an `en` locale object that has `apple` and `banana`.

The `apple` has `no apples | one apple | {count} apples` pluralization message, and the `banana` has `no bananas | {n} banana | {n} bananas` pluralization message.

The number can be accessed within locale messages via predefined named arguments `{count}` and/or `{n}`. You can overwrite those predefined named arguments if necessary.

The following is an example of using `$t`:

```html
<p>{{ $t('apple', 10, { named: { count: 10 } }) }}</p>
<p>{{ $t('apple', 10) }}</p>

<p>{{ $t('banana', 1, { named: { n: 1 } }) }}</p>
<p>{{ $t('banana', 1) }}</p>
<p>{{ $t('banana', 100, { named: { n: 'too many' } }) }}</p>
```

In the above some examples, the first argument is the locale messages key and the second argument is the numeric value or object.

If an object is specified, it’s equivalent to Named interpolation. You can interpolate `n` or `count` with arguments implicit in the pluralization message by giving it.

As result the below:

```html
<p>10 apples</p>
<p>10 apples</p>

<p>1 banana</p>
<p>1 banana</p>
<p>too many bananas</p>
```

## Automatic Pluralization with `Intl.PluralRules`

Vue I18n automatically uses [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) to select the correct plural form based on the current locale. This means that for most languages, you don't need to write custom pluralization rules — just provide the correct number of message cases in CLDR plural category order: `zero | one | two | few | many | other`.

For example, Russian has 4 plural categories (`one`, `few`, `many`, `other`):

```js
const i18n = createI18n({
  locale: 'ru',
  messages: {
    ru: {
      car: '{n} машина | {n} машины | {n} машин | {n} машин',
      //    one          few          many         other
    }
  }
})
```

Vue I18n will automatically select the correct form:

| Value | `Intl.PluralRules` category | Selected case |
|---|---|---|
| 1 | `one` | `{n} машина` |
| 2 | `few` | `{n} машины` |
| 5 | `many` | `{n} машин` |
| 21 | `one` | `{n} машина` |

:::tip NOTE
When the number of message cases exceeds the number of plural categories for the locale, Vue I18n falls back to the default rule (suitable for English).
:::

:::tip NOTE
If `Intl.PluralRules` is not available in the runtime environment, Vue I18n falls back to the default English-based rule.
:::

## Custom Pluralization

While automatic pluralization via `Intl.PluralRules` works for most languages, you may need custom logic for special cases. You can pass an optional `pluralRules` object into `createI18n` options to override the automatic behavior for specific locales.

Very simplified example using rules for Slavic languages (Russian, Ukrainian, etc.):

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

To use the custom rules defined above, inside of `createI18n` set `pluralRules` like the following locale:

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

With the following template:

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

As result the below:

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

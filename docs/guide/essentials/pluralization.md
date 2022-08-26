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

It’s `en` locale an object that has `car` and `apple`.

The `car` has `car | cars` pluralization message, and the `apple` has `no apples | one apple | {count} apples` pluralization message.

These plural messages are selected by the logic of the choice rule for each language in the translaton API according to the numeric value you specify at the translation API.

Vue I18n will be offered some pluralization ways. Here we’ll use the `$tc`.

:::tip NOTE
`$tc` has some overloads. About these overloads, see the [API Reference](../../api/injection#tc-key)
:::

:::tip NOTE
Some ways to support pluralization are:

- `$tc` (for Legacy API mode)
- `v-t` custom directive
- built-in Translation component (`i18n-t`)
- exported `t` from `useI18n` (for Composition API mode)
- injected global `$t` (for Composition API mode)
:::

The following is an example of using the translation API.

```html
<p>{{ $tc('car', 1) }}</p>
<p>{{ $tc('car', 2) }}</p>

<p>{{ $tc('apple', 0) }}</p>
<p>{{ $tc('apple', 1) }}</p>
<p>{{ $tc('apple', 10, { count: 10 }) }}</p>
```

In the above example of using the `$tc`, the first argument is the locale messages key and the second argument is a number. The `$tc` returns the choice message as a result.

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

It’s `en` locale an object that has `apple` and `banana`.

The `apple` has `no apples | one apple | {count} apples` pluralization message, and the `banana` has `no bananas | {n} banana | {n} bananas` pluralization message.

The number can be accessed within locale messages via predefined named arguments `{count}` and/or `{n}`. You can overwrite those predefined named arguments if necessary.

The following is an example of using `$tc`:

```html
<p>{{ $tc('apple', 10, { count: 10 }) }}</p>
<p>{{ $tc('apple', 10) }}</p>

<p>{{ $tc('banana', 1, { n: 1 }) }}</p>
<p>{{ $tc('banana', 1) }}</p>
<p>{{ $tc('banana', 100, { n: 'too many' }) }}</p>
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

## Custom Pluralization

Such pluralization, however, does not apply to all languages (Slavic languages, for example, have different pluralization rules).

To implement these rules you can pass an optional `pluralizationRules` object into `VueI18n` constructor options.

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

To use the custom rules defined above, inside of `createI18n` set either:

1. `pluralizationRules` (for Options API)  
*or*
2. `pluralRules` (for Composition API)

like the the following locale:

```js
const i18n = createI18n({
  locale: 'ru',
  // the custom rules here ...
  pluralizationRules: {
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
<p>{{ $tc('car', 1) }}</p>
<p>{{ $tc('car', 2) }}</p>
<p>{{ $tc('car', 4) }}</p>
<p>{{ $tc('car', 12) }}</p>
<p>{{ $tc('car', 21) }}</p>

<h2>Banana:</h2>
<p>{{ $tc('banana', 0) }}</p>
<p>{{ $tc('banana', 4) }}</p>
<p>{{ $tc('banana', 11) }}</p>
<p>{{ $tc('banana', 31) }}</p>
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

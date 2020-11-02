# Number Localization

## Basic Usage

You can localize the number with your definition formats.

Number formats the below:

```js
const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency', currency: 'USD'
    }
  },
  'ja-JP': {
    currency: {
      style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
    }
  }
}
```

As the above, you can define named number formats (e.g. `currency`, etc), and you need to use [the options with ECMA-402 Intl.NumberFormat](https://tc39.es/ecma402/#numberformat-objects)

After that, when using the locale messages, you need to specify the `numberFormats` option of `createI18n` function:

```js
const i18n = createI18n({
  numberFormats
})
```

To localize Number value with Vue I18n, use the `$n` function.

:::tip NOTE
About number localization for the Compostion API, see here.
:::

The following is an example of the use of `$n` in a template:

```html
<p>{{ $n(100, 'currency') }}</p>
<p>{{ $n(100, 'currency', 'ja-JP') }}</p>
```

The first argument is numeric value as a parameter, and the second argument is number format name as a parameter. The last argument locale value as a parameter.

:::tip NOTE
About `$n` function of parameter details, See the API docs.
:::

As result the below:

```html
<p>$100.00</p>
<p>￥100</p>
```

## Custom Formatting

`$n` function returns resulting string with fully formatted number, which can only be used as a whole. In situations when you need to style some part of the formatted number (like fraction digits), `$n` is not enough. In such cases `<i18n-n>` component will be of help.

With a minimum set of properties, `<i18n-n>` generates the same output as `$n`, wrapped into configured DOM element.

The following template:

```html
<i18n-n tag="span" :value="100"></i18n-n>
<i18n-n tag="span" :value="100" format="currency"></i18n-n>
<i18n-n tag="span" :value="100" format="currency" locale="ja-JP"></i18n-n>
```

`<i18n-n>` component has some props.

The `tag` is the property to set the tag.

The `value` is the property to set the numeric value to be formatted.

The `format` is the property to which the format defined by the `numberFormats` option of `createI18n` function can be set.

The `locale` is the property to set the locale. It’s is localized with the locale specified by this prop instead of the one specified with the `locale` option of `createI18n`.

will produce the below output:

```html
<span>100</span>
<span>$100.00</span>
<span>￥100</span>
```

But the real power of this component comes into play when it is used with [scoped slots](https://v3.vuejs.org/guide/component-slots.html#scoped-slots).

Let's say there is a requirement to render the integer part of the number with a bolder font. This can be achieved by specifying `integer` scoped slot element:

```html
<i18n-n tag="span" :value="100" format="currency">
  <template #integer="slotProps">
    <span styles="font-weight: bold">{{ slotProps.integer }}</span>
  </template>
</i18n-n>
```

Template above will result in the following HTML:

```html
<span>$<span styles="font-weight: bold">100</span>.00</span>
```

It is possible to specify multiple scoped slots at the same time:

```html
<i18n-n tag="span" :value="1234" :format="{ key: 'currency', currency: 'EUR' }">
  <template #currency="slotProps">
    <span styles="color: green">{{ slotProps.currency }}</span>
  </template>
  <template #integer="slotProps">
    <span styles="font-weight: bold">{{ slotProps.integer }}</span>
  </template>
  <template #group="slotProps">
    <span styles="font-weight: bold">{{ slotProps.group }}</span>
  </template>
  <template #fraction="slotProps">
    <span styles="font-size: small">{{ slotProps.fraction }}</span>
  </template>
</i18n-n>
```

(this resulting HTML was formatted for better readability)

```html
<span>
  <span styles="color: green">€</span>
  <span styles="font-weight: bold">1</span>
  <span styles="font-weight: bold">,</span>
  <span styles="font-weight: bold">234</span>
  .
  <span styles="font-size: small">00</span>
</span>
```

:::tip NOTE
Full list of the supported scoped slots as well as other `<i18n-n>` properties can be found on API page.
:::

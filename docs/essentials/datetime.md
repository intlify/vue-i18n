# Datetime Formatting

## Basic Usage
You can localize the datetime with your definition formats.

Datetime formats the below:

```js
const datetimeFormats = {
  'en-US': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  },
  'ja-JP': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true
    }
  }
}
```

As seen above, you can define named datetime format (e.g. `short`, `long`, etc), and you need to use [the options with ECMA-402 Intl.DateTimeFormat](https://tc39.es/ecma402/#datetimeformat-objects)

After that, when using the locale messages, you need to specify the `datetimeFormats` option of `createI18n`:

```js
const i18n = createI18n({
  datetimeFormats
})
```

To localize DateTime value with Vue I18n, use the `$d`.

:::tip NOTE
`$d` has some overloads. About these overloads, see the [API Reference](../api/injection#d-value)
:::

:::tip NOTE
Some ways to support localize are:

- `$d` (for Legacy API mode & Composition API mode)
- built-in DatetimeFormat component (`i18n-d`)
- exported `d` from `useI18n` (for Composition API mode)
:::

The following is an example of the use of `$d` in a template:

```html
<p>{{ $d(new Date(), 'short') }}</p>
<p>{{ $d(new Date(), 'long', 'ja-JP') }}</p>
```

The first argument is datetime able value (e.g. `Date`, timestamp) as a parameter, and the second argument is datetime format name as a parameter. The last argument locale value as a parameter.

As result the below:

```html
<p>Apr 19, 2017</p>
<p>2017年4月19日(水) 午前2:19</p>
```

## Custom Formatting

:::danger NOTE
Not supported IE, due to no support `Intl.DateTimeForamt#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)

If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-datetimeformat)
:::

`$d` returns resulting string with fully formatted datetime, which can only be used as a whole. In situations when you need to style some part of the formatted datetime (like fraction digits), `$d` is not enough. In such cases DatetimeFormat component (`i18n-d`) will be of help.

With a minimum set of properties, `i18n-d` generates the same output as `$d`, wrapped into configured DOM element.

The following template:

```html
<i18n-d tag="p" :value="new Date()"></i18n-d>
<i18n-d tag="p" :value="new Date()" format="long"></i18n-d>
<i18n-d tag="p" :value="new Date()" format="long" locale="ja-JP-u-ca-japanese"></i18n-d>
```

DatetimeFormat component has some props.

The `tag` is the property to set the tag.

The `value` prop is a property to set the datetime able value to be formatted.

The `format` prop is a property to which the format defined by the `datetimeFormats` option of `createI18n` can be set.

The `locale` prop is a property to set the locale. It’s is localized with the locale specified by this prop instead of the one specified with the `locale` option of `createI18n`.

Will produce the below output:

```html
<p>11/3/2020</p>
<p>11/03/2020, 02:35:31 AM</p>
<p>令和2年11月3日火曜日 午前2:35:31 日本標準時</p>
```

But the real power of this component comes into play when it is used with [scoped slots](https://v3.vuejs.org/guide/component-slots.html#scoped-slots).

Let’s say there is a requirement to render the era part of the datetime with a bolder font. This can be achieved by specifying `era` scoped slot element:

```html
<i18n-d tag="span" :value="new Date()" locale="ja-JP-u-ca-japanese" :format="{ key: 'long', era: 'narrow' }">
  <template #era="props">
    <span style="color: green">{{ props.era }}</span>
  </template>
</i18n-d>
```

Template above will result in the following HTML:

```html
<span><span style="color: green;">R</span>2年11月3日火曜日 午前2:35:31 日本標準時</span>
```

It is possible to specify multiple scoped slots at the same time:

```html
<i18n-d tag="span" :value="new Date()" locale="ja-JP-u-ca-japanese" :format="{ key: 'long', era: 'narrow' }">
  <template #era="props">
    <span style="color: green">{{ props.era }}</span>
  </template>
  <template #literal="props">
    <span style="color: green">{{ props.literal }}</span>
  </template>
</i18n-d>
```

(this resulting HTML was formatted for better readability)

```html
<span>
  <span style="color: green;">R</span>2
  <span style="color: green;">年</span>11
  <span style="color: green;">月</span>3
  <span style="color: green;">日</span>火曜日
  <span style="color: green;"> </span>午前3
  <span style="color: green;">:</span>09
  <span style="color: green;">:</span>56
  <span style="color: green;"> </span>日本標準時
</span>
```

:::tip NOTE
Full list of the supported scoped slots as well as other `i18n-d`, properties can be found on [API Reference](../api/component.html#datetimeformat).
:::

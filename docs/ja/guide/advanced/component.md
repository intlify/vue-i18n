# Component Interpolation

## Basic Usage

Sometimes, we need to localize with a locale message that was included in a HTML tag or component. For example:

```html
<p>I accept xxx <a href="/term">Terms of Service Agreement</a></p>
```

In the above message, if you use `$t`, you will probably try to compose the following locale messages:

```js
const messages = {
  en: {
    term1: 'I Accept xxx\'s',
    term2: 'Terms of Service Agreement'
  }
}
```

And your localized template may look like this:

```html
<p>{{ $t('term1') }}<a href="/term">{{ $t('term2') }}</a></p>
```

Output:

```html
<p>I accept xxx <a href="/term">Terms of Service Agreement</a></p>
```

This is very cumbersome, and if you configure the `<a>` tag in a locale message, there is a possibility of XSS vulnerabilities due to localizing with `v-html="$t('term')"`.

You can avoid it using the Translation component (`i18n-t`). For example the below.

Template:

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="term" tag="label" for="tos">
    <a :href="url" target="_blank">{{ $t('tos') }}</a>
  </i18n-t>
  <!-- ... -->
</div>
```

JavaScript:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      tos: 'Term of Service',
      term: 'I accept xxx {0}.'
    },
    ja: {
      tos: '利用規約',
      term: '私は xxx の{0}に同意します。'
    }
  }
})

const app = createApp({
  data: () => ({ url: '/term' })
})

app.use(i18n)
app.mount('#app')
```

The following output:

```html
<div id="app">
  <!-- ... -->
  <label for="tos">
    I accept xxx <a href="/term" target="_blank">Term of Service</a>.
  </label>
  <!-- ... -->
</div>
```

About the above example, see the [example](https://github.com/intlify/vue-i18n-next/blob/master/examples/legacy/components/translation.html)

The children of translation component are interpolated with locale message of `keypath` prop. In the above example,

:::v-pre
`<a :href="url" target="_blank">{{ $t('tos') }}</a>`
:::

Is interpolated with `term` locale message.

In the above example, the component interpolation follows the **list interpolation**. The children of translation component are interpolated by their order of appearance.

<!-- textlint-disable -->
You can choose the root node element type by specifying a `tag` prop. If omitted, it defaults to [Fragments](https://v3.vuejs.org/guide/migration/fragments.html#overview).
<!-- textlint-enable -->

## Slots syntax usage

It’s more convenient to use the named slots syntax. For example the below:

Template:

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="info" tag="p">
    <template v-slot:limit>
      <span>{{ changeLimit }}</span>
    </template>
    <template v-slot:action>
      <a :href="changeUrl">{{ $t('change') }}</a>
    </template>
  </i18n-t>
  <!-- ... -->
</div>
```

JavaScript:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      info: 'You can {action} until {limit} minutes from departure.',
      change: 'change your flight',
      refund: 'refund the ticket'
    }
  }
})

const app = createApp({
  data: () => ({
    changeUrl: '/change',
    refundUrl: '/refund',
    changeLimit: 15,
    refundLimit: 30
  })
})

app.use(i18)
app.mount('#app')
```

Outputs:

```html
<div id="app">
  <!-- ... -->
  <p>
    You can <a href="/change">change your flight</a> until <span>15</span> minutes from departure.
  </p>
  <!-- ... -->
</div>
```

You can also use the following slots shorthand in templates:

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="info" tag="p">
    <template #limit>
      <span>{{ changeLimit }}</span>
    </template>
    <template #action>
      <a :href="changeUrl">{{ $t('change') }}</a>
    </template>
  </i18n-t>
  <!-- ... -->
</div>
```

:::warning LIMITATION
:warning: In translation component, slots props are not supported.
:::

### Pluralization Usage

You can use pluralization in Component interpolation by use `plural` prop. For example the below.

Template:

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="message.plural" locale="en" :plural="count">
    <template #n>
      <b>{{ count }}</b>
    </template>
  </i18n-t>
  <!-- ... -->
</div>
```

JavaScript:

```js
const { createApp, ref } = Vue
const { createI18n } = VueI18n

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      message: {
        plural: 'no bananas | {n} banana | {n} bananas'
      }
    }
  }
})

const app = createApp({
  setup() {
    const count = ref(2)
    return { count }
  }
})
app.use(i18n)
app.mount('#app')
```

The following output:
```html
<div id="app" data-v-app="">
  <!-- ... -->
  <b>2</b> bananas
  <!-- ... -->
</div>
```


## Scope resolving

The [Scope](../essentials/scope.md) resolving of Translation component is `parent` as default.

It meas that Translation component uses the scope that is enabled in the parent component that uses it.

If the parent component has `useI18n` in `'useScope': 'global'`, it will use Global Scope, else if `'useScope': 'local'`, it will use the Local Scope of the parent component.

However, You sometimes meet the warning message on your browser console the following:

```
[intlify] Not found parent scope. use the global scope.
```

This message is displayed in the case that you have not run `useI18n` in the parent component that uses the Translation component.

In that situation, the Scope of the Translation Component will be fallback to the global scope as said the warning message.

A workaround to suppress this warning is to specify `global` as the `scope` property of Translation component.

```html
<i18n-t keypath="message.foo" scope="global">
  ...
</i18n-t>
```

:::tip NOTE
This warning is not output to the browser console in production builds.
:::

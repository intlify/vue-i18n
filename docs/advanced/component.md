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

You can avoid it using the `i18n-t` component. For example the below.

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

JavaScrirpt:

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

The children of `i18n-t` component are interpolated with locale message of `keypath` prop. In the above example,

:::v-pre
`<a :href="url" target="_blank">{{ $t('tos') }}</a>`
:::

Is interpolated with `term` locale message.

In the above example, the component interpolation follows the **list interpolation**. The children of `i18n-t` component are interpolated by their order of appearance.

<!-- textlint-disable -->
You can choose the root node element type by specifying a `tag` prop. If omitted, it defaults to [Fragments](https://v3.vuejs.org/guide/migration/fragments.html#overview).
<!-- textlint-enable -->

## Slots syntax usage

It’s more convenient to use the named slots syntax. For example the below.

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

:::warning Limitation
:warning: In `i18n-t` component, slots props are not supported.
:::

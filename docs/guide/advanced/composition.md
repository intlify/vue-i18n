# Composition API

The introduction of `setup` and Vue’s [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) opens up new possibilities. But to be able to get the full potential out of Vue I18n, we will need to use a few new functions to replace access to `this`.

We have been describing the features of Vue I18n using the Legacy API, which is compatible with vue-i18n v8.x. Now let’s take a look at Vue I18n `useI18n` for Composition API.

## Basic Usage

Let’s look at the basic usage of Vue I18n Composition API! Here we will learn the basic usage by modifying the code in [Getting Started](../../guide/essentials/started) to learn the basic usage.

To compose with `useI18n` in `setup` of Vue 3, there is one thing you need to do, you need set the `legacy` option of the `createI18n` function to `false`.

The following is an example of adding the `legacy` option to `createI18n`:

```js{4}
// ...

const i18n = VueI18n.createI18n({
  legacy: false, // you must set `false`, to use Composition API // [!code ++]
  locale: 'ja',
  fallbackLocale: 'en',
  messages: {
    en: {
      message: {
        hello: 'hello world'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、世界'
      }
    }
  }
})

// ...
```

You can set `legacy: false` to allow Vue I18n to switch the API mode, from Legacy API mode to Composition API mode.

:::tip NOTE
The following properties of i18n instance created by `createI18n` change its behavior:

- `mode` property: `"legacy"` to `"composition"`
- `global` property: VueI18n instance to Composer instance
:::

You are now ready to use `useI18n` in the `App.vue` component. The code looks like this:

```vue
<script setup> // [!code ++]
import { useI18n } from 'vue-i18n' // [!code ++]
const { t } = useI18n() // [!code ++]
</script> // [!code ++]

<template>
  <h1>{{ $t("message.hello") }}</h1>
</template>
```

You must call `useI18n` at top of the `<script setup>`.

The `useI18n` returns a Composer instance. The Composer instance provides a translation API such as the `t` function, as well as properties such as `locale` and `fallbackLocale`, just like the VueI18n instance. For more information on the Composer instance, see the [API Reference](../../api/composition#composer).

In the above example, there are no options for `useI18n`, so it returns a Composer instance that works with the global scope. As such, it returns a Composer instance that works with the global scope, which means that the localized message referenced by the spread `t` function here is the one specified in `createI18n`.

you can use `t` in the components template:

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <h1>{{ $t("message.hello") }}</h1> // [!code --]
  <h1>{{ t("message.hello") }}</h1> // [!code ++]
</template>
```

The output follows:

```vue
<div id="app">
  <p>こんにちは、世界</p>
</div>
```

## Message Translation

In the Legacy API mode, the messages were translated using either `$t` or the VueI18n instance of `t`.

In the Composition API mode, the Message Format Syntax remains the same as in the Legacy API mode. You can use the Composer instance `t` to translate a message as follows:

```vue
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      msg: 'hello',
      named: '{msg} world!',
      list: '{0} world!',
      literal: "{'hello'} world!",
      the_world: 'the world',
      dio: 'DIO:',
      linked: '@:dio @:the_world !!!!'
    },
    ja: {
      msg: 'こんにちは',
      named: '{msg} 世界！',
      list: '{0} 世界！',
      literal: "{'こんにちは'} 世界！",
      the_world: 'ザ・ワールド！',
      dio: 'ディオ:',
      linked: '@:dio @:the_world ！！！！'
    }
  }
})

const msg = computed(() => t('msg'))
</script>

<template>
  <p>{{ t('named', { msg }) }}</p>
  <p>{{ t('list', [msg]) }}</p>
  <p>{{ t('literal') }}</p>
  <p>{{ t('linked') }}</p>
</template>

```

For more details of `t`, see the [API Reference](../../api/composition#t-key).

## Pluralization

In the Legacy API mode, the plural form of the message was translated using either `$tc` or the VueI18n instance of `tc` to translate the message.

In the Composition API mode, the plural form of the message is left in syntax as in the Legacy API mode, but is translated using the `t` of the Composer instance:

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      car: 'car | cars',
      apple: 'no apples | one apple | {count} apples',
      banana: 'no bananas | {n} banana | {n} bananas'
    }
  }
})
</script>

<template>
  <h2>Car:</h2>
  <p>{{ t('car', 1) }}</p>
  <p>{{ t('car', 2) }}</p>
  <h2>Apple:</h2>
  <p>{{ t('apple', 0) }}</p>
  <p>{{ t('apple', 1) }}</p>
  <p>{{ t('apple', { count: 10 }, 10) }}</p>
  <p>{{ t('apple', 10) }}</p>
  <h2>Banana:</h2>
  <p>{{ t('banana', { n: 1 }, 1) }}</p>
  <p>{{ t('banana', 1) }}</p>
  <p>{{ t('banana', { n: 'too many' }, 100) }}</p>
</template>
```

:::tip NOTE
In the Composition API mode, plural translations have been integrated into `t`.
:::

## Datetime Formatting

In the Legacy API mode, Datetime value was formatted using `$d` or the VueI18n instance of `d`.

In the Composition API mode, it uses the `d` of the Composer instance to format:

```vue
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, d } = useI18n({
  locale: 'en-US',
  messages: {
    'en-US': {
      current: 'Current Datetime'
    }
  },
  datetimeFormats: {
    'en-US': {
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    }
  }
})

const now = ref(new Date())
</script>

<template>
  <p>{{ t('current') }}: {{ d(now, 'long') }}</p>
</template>

```

For more details of `d`, see the [API Reference](../../api/composition#d-value).

## Number Formatting

In the Legacy API mode, Number value is formatted using `$n` or the `n` of the VueI18n instance.

In the Composition API mode, it is formatted using the `n` of the Composer instance:

```vue
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, n } = useI18n({
  locale: 'en-US',
  messages: {
    'en-US': {
      money: 'Money'
    }
  },
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    }
  }
})

const money = ref(1000)
</script>

<template>
  <p>{{ t('money') }}: {{ n(money, 'currency') }}</p>
</template>
```

For more details of `n`, see the [API Reference](../../api/composition#n-value).

## Global scope

A global scope in the Composition API mode is created when an i18n instance is created with `createI18n`, similar to the Legacy API mode.

While the Legacy API mode `global` property of the i18n instance is the VueI18n instance, the Composition API mode allows you to reference the Composer instance.

There are two ways to refer the global scope Composer instance at the component.

### Explicit with `useI18n`

As we have explained, in `useI18n` is a way.

```ts
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

// Something to do here ...
```

The above code sets the `useI18n` option to `useScope: 'global'`, which allows `useI18n` to return a Composer instance that can be accessed by the i18n instance `global` property. The Composer instance is a global scope.

Then you can compose using the functions and properties exposed from the Composer instance.

:::tip NOTE
If you set `useI18n` to `messages`, `datetimeFormats`, and `numberFormats` together `useScope: 'global’`, **they will be merged into global scope**. That is, they will be managed by `messages`, `datetimeFormasts`, and `numberFormats` of the global scope Composer instance.

And also, if [`global` is specified in i18n custom blocks](../advanced/sfc#define-locale-messages-for-global-scope) (e.g. `<i18n global>{ … }</i18n>`), the locale messages defined in the blocks are merged with the global scope.
:::

### Implicit with injected properties and functions

Another way to refer a global scope Composer instance is through properties and functions implicitly injected into the component.

You need to specify **`globalInjection: true`** together with `legacy: false` as an option for `createI18n`, because disabled by default.

:::tip NOTE
vue-i18n v9.2-beta.34 or later, `globalInjection` is `true` by default.
:::

This allows Vue I18n to inject the following properties and functions into the components:

- `$i18n`: An object wrapped with the following global scope Composer instance properties
  - `locale`
  - `fallbackLocale`
  - `availableLocales`
- `$t`: `t` function of Composer that is global scope
- `$rt`: `rt` function of Composer that is global scope
- `$d`: `d` function of Composer that is global scope
- `$n`: `n` function of Composer that is global scope
- `$tm`: `tm` function of Composer that is global scope

The Vue 3 runtime globally injects components with what is set in `app.config.globalProperties`. Thus, the ones listed above are injected by the Vue 3 runtime and can therefore be used implicitly in template.

:::warning NOTICE
- The `setup` does not allow to see these properties and functions injected into the component
- In Legacy API mode, some Vue I18n APIs prefixed with `$` were injected, but the properties and functions prefixing components with `$` and injected in Composition API mode are different from the Legacy API mode.
:::

You’ve noticed that the ones listed above are prefixed with `$`. The reason for prefixing them with `$` is that they are:

- The `setup` does not conflict with the properties and functions returned by render context
- Global scope accessible identifier for Vue I18n Composition API mode

By doing so, the user is made aware that they are special properties and functions.

:::warning NOTICE
If your Vue application doesn't use local scope and does everything i18n in global scope, this is very useful as it does not need to run `useI18n` in the `setup` for each component. However, this way has the problem with global variables of the same nature. You should be used with caution, especially for large Vue applications.

If you use it once and stop using it, you must change all the properties or functions used in the templates to those of the setup context returned with the `setup` using the `useI18n` with `useScope: 'global'` option.
:::

## Local scope

In Legacy API mode, VueI18n instance is created by specifying the `i18n` component option for each component. This enables resources such as local messages managed by VueI18n instance to be local scopes that could be referenced only by the target component.

To enable local scope in the Composition API mode, you need to set an option to `useI18n`, which will create a new instance of Composer based on the given locale, locale messages, etc. When the option is given, `useI18n` creates and returns a new Composer instance based on the locale, locale messages, and other resources specified by the option.

:::tip NOTE
You can explicit specify `useScope: ‘local’` option.
:::

The following example codes:

```js
import { useI18n } from 'vue-i18n'

const { t, d, n, tm, locale } = useI18n({
  locale: 'ja-JP',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': {
      // ....
    },
    'ja-JP': {
      // ...
    }
  },
  datetimeFormats: {
    'en-US': {
      // ....
    },
    'ja-JP': {
      // ...
    }
  },
  numberFormats: {
    'en-US': {
      // ....
    },
    'ja-JP': {
      // ...
    }
  }
})

// Something to do here ...
```

### Locale messages

If you use i18n custom blocks in SFC as i18n resource of locale messages, it will be merged with the locale messages specified by the `messages` option of `useI18n`.

The following is an example of using i18n custom blocks and `useI18n` options:

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import en from './en.json'

const { t, availableLocales, getLocaleMessages } = useI18n({
  locale: 'en',
  messages: {
    en
  }
})

availableLocales.forEach(locale => {
  console.log(`${locale} locale messages`, getLocaleMessages(locale))
})
</script>

<i18n locale="ja">
{
  "hello": "こんにちは！"
}
</i18n>
```

:::tip NOTE
In this example, the definition of resources is separated from i18n custom blocks and the `messages` option of `useI18n`, but in local scope, resource messages are specified in the `messages` option in a lump sum for administrative purposes in resource messages or define all resource messages in the i18n custom blocks, which is preferable.
:::

### Shared locale messages for components


In composition API mode, use `mergeLocaleMessage` exported by `useI18n`.

Common locale messages example:

```js
export default {
  en: {
    buttons: {
      save: "Save",
      // ...
    }
  },
  ja: {
    buttons: {
      save: "保存",
      // ...
    }
  }
}
```

use `mergeLocaleMessage` on Components:

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import commonMessages from './locales/common'

const { t, mergeLocaleMessage } = useI18n({
  locale: 'en',
  messages: {
    en: {
      hello: 'Hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  }
})

for (const locale of ['en', 'ja']) {
  mergeLocaleMessage(locale, commonMessages[locale])
}
</script>
```

## Locale Changing

### Global Scope

You want to change the locale with `<script setup>`, just get a global Composer with `useI18n` and change it using the `locale` property of the instance.

```vue
<script setup>
const { t, locale } = useI18n({ useScope: 'global' })

locale.value = 'en' // change!
</script>
```

And you can also use the setup context in the template, which can be changed as follows:

```vue
<select v-model="locale">
  <option value="en">en</option>
  <option value="ja">ja</option>
</select>
```

When you change the locale of the global scope, components that depend on the global scope, such as `t` translation API can work reactively and switch the display messages to those of the target locale.

If you are using the [implicit way](composition#implicit-with-injected-properties-and-functions), you can also change it in template with `$i18n.locale`, as follows:

```vue
<select v-model="$i18n.locale">
  <option value="en">en</option>
  <option value="ja">ja</option>
</select>
```

### Local Scope

The local scope locales, that is, the  Composer instance `locale` property returned by `useI18n`, are inherited from the global scope, as is the Legacy API. Therefore, when you change the locale at global scope, the inherited local scope locale is also changed. If you want to switch the locale for the whole application, you can use the `locale` returned by `useI18n({ useScope: 'global' })` or, if you use [implicit way](composition#implicit-with-injected-properties-and-functions), you can use `$i18n.locale`.

:::tip NOTE
If you do not want to inherit the locale from the global scope, the `inheritLocale` option of `useI18n` must be `false`.
:::

:::warning NOTICE
Changes to the `locale` at the local scope have **no effect on the global scope locale, but only within the local scope**.
:::

## Mapping between VueI18n instance and Composer instance

The API offered by the Composer instance in the Composition API is very similar interface to the API provided by the VueI18n instance.

:::tip MEMO
Internally, the VueI18n instance of the Legacy API mode works by wrapping the Composer instance.
For this reason, the performance overhead is less in the Composition API mode than in the Legacy API mode.
:::

Below is the mapping table:

| VueI18n instance  | Composer instance       |
| ----------------- | ----------------------- |
| `id` | `id` |
| `locale` | `locale` |
| `fallbackLocale` | `fallbackLocale` |
| `availableLocales` | `availableLocales` |
| `messages` | `messages` |
| `datetimeFormats` | `datetimeFormats` |
| `numberFormats` | `numberFormats` |
| `modifiers` | `modifiers` |
| `missing` | `getMissingHandler` / `setMissingHandler` |
| `postTranslation` | `getPostTranslationHandler` / `setPostTranslationHandler`|
| `silentTranslationWarn` | `missingWarn` |
| `silentFallbackWarn` | `fallbackWarn` |
| `formatFallbackMessages` | `fallbackFormat` |
| `sync` | `inheritLocale` |
| `warnHtmlInMessage` | `warnHtmlMessage` |
| `escapeParameterHtml` | `escapeParameter` |
| `t` | `t` |
| `tc` | `t` |
| `te` | `te` |
| `tm` | `tm` |
| `getLocaleMessage` | `getLocaleMessage` |
| `setLocaleMessage` | `setLocaleMessage`|
| `mergeLocaleMessage` | `mergeLocaleMessage` |
| `d` | `d` |
| `getDateTimeFormat` | `getDateTimeFormat` |
| `setDateTimeFormat` | `setDateTimeFormat` |
| `mergeDateTimeFormat` | `mergeDateTimeFormat` |
| `n` | `n` |
| `getNumberFormat` | `getNumberFormat` |
| `setNumberFormat` | `setNumberFormat` |
| `mergeNumberFormat` | `mergeNumberFormat` |

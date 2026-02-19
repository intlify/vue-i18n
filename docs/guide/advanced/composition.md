# Composition API

Vue I18n provides the `useI18n` composable for the Composition API. This section covers how to use `useI18n` to access translation functions and manage i18n resources in your components.

## Basic Usage

Let's look at the basic usage of `useI18n`! Here we will learn the basic usage by modifying the code in [Getting Started](../essentials/started).

First, create an i18n instance with `createI18n`:

```js
// ...

const i18n = VueI18n.createI18n({
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

You are now ready to use `useI18n` in the `App.vue` component. The code looks like this:

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <h1>{{ t("message.hello") }}</h1>
</template>
```

You must call `useI18n` at the top of the `<script setup>`.

The `useI18n` returns a Composer instance. The Composer instance provides a translation API such as the `t` function, as well as properties such as `locale` and `fallbackLocale`. For more information on the Composer instance, see the [API Reference](../../api/general/interfaces/Composer.md).

In the above example, there are no options for `useI18n`, so it returns a Composer instance that works with the global scope. This means that the localized message referenced by the `t` function is the one specified in `createI18n`.

The output follows:

```html
<div id="app">
  <h1>こんにちは、世界</h1>
</div>
```

## Message Translation

You can use the Composer instance `t` to translate a message as follows:

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

For more details of `t`, see the [API Reference](../../api/general/interfaces/Composer.md#t)

## Pluralization

The plural form of the message uses the same syntax, and is translated using `t`:

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
Plural translations are integrated into `t`.
:::

## Datetime Formatting

Use the `d` function from the Composer instance to format datetime values:

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

For more details of `d`, see the [API Reference](../../api/general/interfaces/Composer.md#d)

## Number Formatting

Use the `n` function from the Composer instance to format number values:

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

For more details of `n`, see the [API Reference](../../api/general/interfaces/Composer.md#n)

## Global scope

A global scope is created when an i18n instance is created with `createI18n`. The `global` property of the i18n instance references the global Composer instance.

There are two ways to refer the global scope Composer instance at the component.

### Explicit with `useI18n`

You can explicitly access the global scope by passing `useScope: 'global'` to `useI18n`:

<!-- eslint-skip -->

```ts
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

// Something to do here ...
```

The above code sets the `useI18n` option to `useScope: 'global'`, which allows `useI18n` to return a Composer instance that can be accessed by the i18n instance `global` property. The Composer instance is a global scope.

Then you can compose using the functions and properties exposed from the Composer instance.

:::tip NOTE
If you set `useI18n` to `messages`, `datetimeFormats`, and `numberFormats` together `useScope: 'global'`, **they will be merged into global scope**. That is, they will be managed by `messages`, `datetimeFormats`, and `numberFormats` of the global scope Composer instance.

And also, if [`global` is specified in i18n custom blocks](../advanced/sfc#define-locale-messages-for-global-scope) (e.g. `<i18n global>{ … }</i18n>`), the locale messages defined in the blocks are merged with the global scope.
:::

### Implicit with injected properties and functions

Another way to refer a global scope Composer instance is through properties and functions implicitly injected into the component.

By default (`globalInjection: true`), Vue I18n injects the following properties and functions into the components:

- `$i18n`: An object with the following global scope properties
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
The `setup` does not allow to see these properties and functions injected into the component.
:::

You've noticed that the ones listed above are prefixed with `$`. The reason for prefixing them with `$` is that they are:

- The `setup` does not conflict with the properties and functions returned by render context
- Global scope accessible identifier for Vue I18n Composition API mode

By doing so, the user is made aware that they are special properties and functions.

:::warning NOTICE
If your Vue application doesn't use local scope and does everything i18n in global scope, this is very useful as it does not need to run `useI18n` in the `setup` for each component. However, this way has the problem with global variables of the same nature. You should be used with caution, especially for large Vue applications.

If you use it once and stop using it, you must change all the properties or functions used in the templates to those of the setup context returned with the `setup` using the `useI18n` with `useScope: 'global'` option.
:::

## Local scope

To enable local scope, you need to set an option to `useI18n`, which will create a new instance of Composer based on the given locale, locale messages, etc. When the option is given, `useI18n` creates and returns a new Composer instance based on the locale, locale messages, and other resources specified by the option.

:::tip NOTE
You can explicitly specify `useScope: 'local'` option.
:::

The following example codes:

<!-- eslint-skip -->

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

<!-- eslint-skip -->

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

Use `mergeLocaleMessage` exported by `useI18n` to share locale messages across components.

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

<!-- eslint-skip -->

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

<!-- eslint-skip -->

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

The local scope locales, that is, the Composer instance `locale` property returned by `useI18n`, are inherited from the global scope. Therefore, when you change the locale at global scope, the inherited local scope locale is also changed. If you want to switch the locale for the whole application, you can use the `locale` returned by `useI18n({ useScope: 'global' })` or, if you use [implicit way](composition#implicit-with-injected-properties-and-functions), you can use `$i18n.locale`.

:::tip NOTE
If you do not want to inherit the locale from the global scope, the `inheritLocale` option of `useI18n` must be `false`.
:::

:::warning NOTICE
Changes to the `locale` at the local scope have **no effect on the global scope locale, but only within the local scope**.
:::

## Mapping from VueI18n to Composer

If you are migrating from v11 or earlier, see the [v12 Breaking Changes](../migration/breaking12#drop-legacy-api-mode) for a detailed mapping between the VueI18n instance (Legacy API) and the Composer instance (Composition API).

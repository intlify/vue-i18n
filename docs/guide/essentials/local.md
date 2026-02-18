# Local Scope Based Localization

## Using `useI18n` with local messages

[In *'Scope and Locale Changing'*](scope), Vue I18n has two scope concepts, global scope and local scope.

In general, locale info (e.g. `locale`, `messages`, etc) is set as option of `createI18n` and it sets (install) with `app.use`. To sum up, you use global scope translation functions like `t` (from `useI18n()`) or `$t` to localize them.

Sometimes it is necessary to localize per component while still managing the resources of the local messages. In this case it can be useful to localize each local scope using `useI18n()` with local messages or the `<i18n>` custom block instead of the global scope.

:::tip NOTE
If you are using Vue I18n v11 or earlier with the `i18n` component option, see the [v11 Guide](../v11/essentials/local).
:::

The following is an example of local scope based localization:

**main.js:**

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

// setting locale info used by global scope as options
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello world',
        greeting: 'good morning, world!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、世界',
        greeting: 'おはよう、世界！'
      }
    }
  }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
```

**Component1.vue** (local scope with `useI18n`):

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  messages: {
    en: { message: { hello: 'hello component1' } },
    ja: { message: { hello: 'こんにちは、component1' } }
  }
})
</script>

<template>
  <div id="component">
    <h1>Component1</h1>
    <p>Component1 locale messages: {{ t("message.hello") }}</p>
    <p>Fallback global locale messages: {{ t("message.greeting") }}</p>
  </div>
</template>
```

**App.vue:**

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import Component1 from './Component1.vue'

const { t } = useI18n()
</script>

<template>
  <div id="app">
    <h1>Root</h1>
    <p>{{ t("message.hello") }}</p>
    <Component1 />
  </div>
</template>
```

Outputs the following:

```html
<div id="app">
  <h1>Root</h1>
  <p>こんにちは、世界</p>
  <div class="component">
    <p>Component1 locale messages: こんにちは、component1</p>
    <p>Fallback global locale messages: おはよう、世界！</p>
  </div>
</div>
```

As in the example above, if the component doesn't have the locale message, it falls back to global scope. As explained [here](scope#local-scope-2), due to the `locale` of local scope inherits from global scope, so the component uses the language set in global scope (in the above example: `locale: 'ja'`)

And also, as explained [here](fallback#explicit-fallback-with-one-locale), note that, by default, falling back to global scope generates two warnings in the console:

```txt
[intlify] Not found 'message.greeting' key in 'ja' locale messages.
[intlify] Fall back to translate 'message.greeting' with root locale.
```

If you want to localize using the component locale, you can do that with `inheritLocale: false` and `locale` in the `useI18n()` options.

## Shared locale messages for components

Sometimes you may want to import shared locale messages for certain components, not fallback from locale messages of global scope (e.g. common messages of certain feature for components).

You can merge shared messages into the component's local scope using the `messages` option of `useI18n()`.

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

Component using shared messages:

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import commonMessages from './locales/common'

const { t } = useI18n({
  messages: {
    en: { ...commonMessages.en, /* component-specific messages */ },
    ja: { ...commonMessages.ja, /* component-specific messages */ }
  }
})
</script>

<template>
  <div class="modal">
    <div class="body">
      <p>This is good service</p>
    </div>
    <div class="footer">
      <button type="button">{{ t('buttons.save') }}</button>
    </div>
  </div>
</template>
```

The shared messages will be merged into locale messages into the Composer instance of the target component.

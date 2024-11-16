# Local Scope Based Localization

## i18n component options

[In *'Scope and Locale Changing’*](scope), Vue I18n has two scope concepts, global scope and local scope.

In general, locale info (e.g. `locale`,`messages`, etc) is set as option of `createI18n` and it sets (install) with `app.use`. To sum up, you use global scope translation functions `$t` to localize them.

Sometimes it is necessary to localize per component while still managing the resources of the local messages. In this case it can be useful to localize each local scope using i18n component option on the component instead of the global scope.

The following is an example of local scope based localization:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

// setting locale info used by global scope as an options
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

// define component
const Component1 = {
  template: `
    <div id="component">
      <h1>Component1</h1>
      <p>Component1 locale messages: {{ $t("message.hello") }}</p>
      <p>Fallback global locale messages: {{ $t("message.greeting") }}</p>
    </div>
  `,
  i18n: {
    messages: {
      en: { message: { hello: 'hello component1' } },
      ja: { message: { hello: 'こんにちは、component1' } }
    }
  }
}

const app = createApp({
  components: { Component1 }
})
app.use(i18n)
app.mount('#app')
```

Template:


```html
<div id="app">
  <h1>Root</h1>
  <p>{{ $t("message.hello") }}</p>
  <Component1 />
</div>
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

As in the example above, if the component doesn't have the locale message, it falls back to global scope. As explained the [here](scope#local-scope-2), due to the `locale` of local scope inherits from global scope, so the component uses the language set in global scope (in the above example: `locale: 'ja'`)

And also, as explained the [here](fallback#explicit-fallback-with-one-locale), note that, by default, falling back to global scope generates two warnings in the console:

```
[intlify] Not found 'message.greeting' key in 'ja' locale messages.
[intlify] Fall back to translate 'message.greeting' with root locale.
```

If you want to localize using the component locale, you can do that with `sync: false` and `locale` in the `i18n` component option.

## Shared locale messages for components

Sometimes you may want to import shared locale messages for certain components, not fallback from locale messages of global scope (e.g. common messages of certain feature for components).

You can use `sharedMessages` options of `i18n`.

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

Components:

```js
import commonMessage from './locales/common' // import common locale messages

export default {
  name: 'ServiceModal',
  template: `
    <div class="modal">
      <div class="body">
        <p>This is good service</p>
      </div>
      <div class="footer">
        <button type="button">{{ $t('buttons.save') }}</button>
      </div>
    </div>
  `,
  i18n: {
    messages: { ... },
    sharedMessages: commonMessages
  }
}
```

If `sharedMessages` option is specified along with the `messages` option, those messages will be merged into locale messages into the VueI18n instance of the target component.

# Breaking Changes

Most of the APIs offered in Vue I18n v9 (for Vue 3) strive to maintain compatibility, to ease the pain of migration from v8 (for Vue 2). But there are still a few breaking changes that you might encounter while migrating your application. This guide is how to adapt your application to make it work with Vue I18n v9.


## APIs

### `new VueI18n` becomes `createI18n`

Vue I18n is no longer a class but a set of functions. Instead of writing `new VueI18n()`, you now have to call `createI18n`:

Vue I18n v8.x:

```js{2,4,6-8,11}
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  // ...
})

new Vue({
  i18n,
  // ...
})
```

Vue I18n v9 or later:

```js{2,4-6,11}
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // ...
})

const app = createApp({
  // ...
})
app.use(i18n)
```

**Reason**: Vue 3 [Global API changes](https://v3-migration.vuejs.org/breaking-changes/global-api.html), and Vue 3 API architecture changes related for component instances.

### Rename to `datetimeFormats` from `dateTimeFormats`

Vue I18n v8.x:

```js{3-5}
const i18n = new VueI18n({
  // ...
  dateTimeFormats: {
    // ...
  }
})
```

Vue I18n v9 or later:

```js{3-5}
const i18n = createI18n({
  // ...
  datetimeFormats: {
    // ...
  }
})
```

### Translation API return value

The translation API like `$t` and `t` function that return **string** only. Object and array values are no longer returned.

Vue I18n v8.x:

```js{24}
// e.g. Array structure locale messages
const i18n = new VueI18n({
  messages: {
    en: {
      errors: [
        'invalid argument',
        // ...
        'unexpected errors'
      ]
    }
  }
})

// e.g. Error Component
const ErrorMessage = {
  props: {
    code: {
      type: Number,
      required: true
    }
  },
  template: `<p class="error">{{ getErrorMessage(code) }}</p>`,
  methods: {
    getErrorMessage(code) {
      return this.$t('errors')[code]
    }
  }
}
```

In Vue I18n v9 or later, it change to be getting locale messages with `$tm` / `tm`, and to resolve locale messages with `$rt` or `rt`. The following Composition API example:

```js{24}
// e.g. Array structure locale messages
const i18n = createI18n({
  messages: {
    en: {
      errors: [
        'invalid argument',
        // ...
        'unexpected errors'
      ]
    }
  }
})

// e.g. Error Component
const ErrorMessage = {
  props: {
    code: {
      type: Number,
      required: true
    }
  },
  template: `<p class="error">{{ errors(code) }}</p>`,
  setup() {
    const { tm, rt } = useI18n()
    const errors = (code) => rt(tm('errors')[code])
    return { errors }
  }
}
```

**Reason**: To make **simple obligation** to return the translation results, and it’s also to support TypeScript types.

### Pluralization API return value

Similar to *[Translation API return value](#translation-api-return-value)*, the pluralization API like `$tc` and `tc` function that return **string** only. Object and array values are no longer returned.

**Reason**: To make **simple obligation** to return the translation results, and it’s also to support TypeScript types.

### Remove `getChoiceIndex`

To customize the pluralization rules, Vue I18n v8.x extends `getChoiceIndex` of VueI18n class.

Vue I18n v8.x:

```js
VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
  // this === VueI18n instance, so the locale property exists
  if (this.locale !== 'ru') {
    // proceed to the default implementation
  }

  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;

  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }
  return (choicesLength < 4) ? 2 : 3;
}
```

In Vue I18n v9 or later, you can customize it with the following options:

Legacy API mode:

```js{21-24}
import { createI18n } from 'vue-i18n'

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

const i18n = createI18n({
  // ...
  pluralizationRules: {
    ru: customRule,
    // ...
  },
  // ...
})
```

Composition API mode:

```js{23-26}
import { useI18n } from 'vue-i18n'

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

const MyComp = {
  setup() {
    const { t } = useI18n({
      // ...
      pluralRules: {
        ru: customRule,
        // ...
      },
      // ...
    })

    // ...
  }
}
```

**Reason**: VueI18n class has been removed.

### Change `warnHtmlInMessage` option default value

In Vue I18n v8.x, the value of `warnHtmlInMessage` was `"off"`. Therefore, by default, no warning is output to the console even if the message contains HTML.

In Vue I18n v9 or later, change the default values as follows:

- Legacy API mode: `warnHtmlInMessage` property: `"warn"`
- Composition API mode: `warnHtmlMessage` boolean property, default `true`

In development mode, unless you change this value, you will **receive the warning to the console by default**.

In production mode, it does not detect if the message contains HTML to maximize performance.

**Reason**: to make stronger security for locale messages

### Version info

Version information is now accessible in import syntax instead of the VueI18n class static property.

Vue I18n v8.x:

```js
import VueI18n from 'vue-i18n'

console.log(VueI18n.version)
```

Vue I18n v9 or later:

```js
import { VERSION } from 'vue-i18n'

console.log(VERSION)
```

**Reason**: Tree shaking optimization, and VueI18n class has been removed.

### Remove Intl availability

Removed as major browsers now support the [ECMAScript Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

Vue I18n v8.x:

```js
import VueI18n from 'vue-i18n'

console.log(VueI18n.availability)
```

**Reason**: IE9 end of life, and VueI18n class has been removed.

### Remove Custom formatter

**Reason**: Due to hard to provide custom formats in the new compiler and runtime APIs. We are planning to support it in the next major version to support in these APIs. If you would like to use ICU message format, you can use the [@formatjs/vue-intl](https://formatjs.io/docs/vue-intl/)

### Remove `preserveDirectiveContent` option

The `v-t` directive for Vue 3 now preserves the default content. Therefore, this option and its properties have been removed from the VueI18n instance.

Vue I18n v8.x:

```js
import VueI18n from 'vue-i18n'

const i18n = new VueI18n({
  // ...
  preserveDirectiveContent: true,
  // ...
})
```

**Reason**: Keep the content to element with `v-t` directive

## Message Format Syntax

### Remove array-like object for List interpolation

In Vue I18n v8.x, List interpolation could use an array-like object as a parameter, such as the following:

```js
import VueI18n from 'vue-i18n'

const i18n = new VueI18n({
  // ...
  messages: {
    en: {
      greeting: 'hello, {0}!'
    }
  },
  // ...
})
```

```html
<p>{{ $t('greeting', { '0': 'kazupon' }) }}</p>
```

In Vue I18n v9 or later, you can’t use array-like objects for list interpolation, you have to use array:

```html
<p>{{ $t('greeting', ['kazupon']) }}</p>
```

**Reason**: provide a Translation API with a consistent argument I/F

### Special character handling

The messages that can be translated by Vue I18n can be highly translated using message format syntax, such as the following:

```
@.caml:{'no apples'} | {0} apple | {n}　apples
```

The message format syntax can be expressed using the following special characters that are used:

- `{`, `}`, `@`, `$`, `|`

Since Vue I18n v9 and later, message format syntax is now handled by the message format compiler, if you use these special characters as part of a message, the message will occur error at compile. If you want to use these special characters, you **have to use literal interpolation**.

```
// e.g. `@` use-case for mail address
{emailItendity}{'@'}{emailDomain}
```

**Reason**: In order for the message format compiler to correctly handle the special characters of the syntax used in the message format syntax, it is necessary to limit them.

### Remove brackets grouping for Linked messages

In Vue I18n v8.x, the distinction was made between key references in Linked messages and messages using brackets `()` to distinguish between them.

Vue I18n v8.x:

```js{5}
const messages = {
  en: {
    message: {
      dio: 'DIO',
      linked: 'There\'s a reason, you lost, @:(message.dio).'
    }
  }
}
```

In Vue I18n v9 or later, brackets are no longer needed as the message format compiler allows you to handle **named, list, and literal interpolations**.

Vue I18n v9 or later:
```js
const messages = {
  en: {
    message: {
      dio: 'DIO',
      linked: "There\'s a reason, you lost, @:{'message.dio'}."
    }
  }
}
```

## `v-t` directive

### Remove `preserve` modifier

Similar to *[Remove `preserveDirectiveContent` option](#remove-preservedirectivecontent-option)*, the `v-t` directive for Vue 3 now preserves the default content. Therefore, `preserve` modifier and it’s have been removed from `v-t` directive.

Vue I18n v8.x:

```html
<p v-t.preserve="'hello'"></p>
```

**Reason**: Keep the content to element with `v-t` directive

## Translation component

### Rename to `i18n-t`from `i18n`

The tag name of the translation component (called *i18n functional component* in Vue I18n v8.x) has been changed.

Vue I18n v8.x:

```html
<i18n path="message.greeting" />
```

Vue I18n v9 or later:

```html
<i18n-t keypath="message.greeting" />
```

**Reason**: tag name same i18n custom blocks `<i18n>`, so it’s confusing with the block names and prone to mistakes in SFC.

### `tag` prop is optional

In Vue I18n v8.x, `tag` prop could be used to render child elements without the root element by specifying a tag name and the `Boolean` value `false`.

Vue I18n v8.x:

```html{1,3}
<i18n :tag="false" path="message.greeting">
  <span>hello!</span>
</i18n>
```

Since Vue I18n v9 or later, you can do the same by omitting the `tag` prop.

Vue I18n v9 or later:

```html{1,3}
<i18n-t keypath="message.greeting">
  <span>hello!</span>
</i18n-t>
```

**Reason**: Since Vue 3 now supports Fragments

### Rename to `keypath` prop from `path` prop

Vue I18n v8.x:

```html
<i18n path="message.greeting" />
```

Vue I18n v9 or later:

```html
<i18n-t keypath="message.greeting" />
```

### Remove place syntax with `place` attr and `places` prop

In Vue I18n v9 or later, the `place` attr and `places` prop have been removed from component interpolation.

Vue I18n v8.x:

```html
<i18n path="info" tag="p" :places="{ limit: refundLimit }">
  <span place="limit">{{ refundLimit }}</span>
  <a place="action" :href="refundUrl">{{ $t('refund') }}</a>
</i18n>
```

Vue I18n v9 or later:

```html
<i18n-t keypath="info" tag="p">
  <template #limit>
    <span>{{ refundLimit }}</span>
  <template>
  <template #action>
    <a :href="refundUrl">{{ $t('refund') }}</a>
  <template>
</i18n-t>
```

**Reason**: Since be able to do the same thing with slots

## NumberFormat component

### `tag` prop is optional

Similar to *[Translation component section](#tag-prop-is-optional)*, In NumberFormat component (called *i18n-n functional component* in Vue I18n v8.x) `tag` prop could be used to render child elements without the root element by specifying a tag name and the `Boolean` value `false`.

Vue I18n v8.x:

```html
<i18n-n :tag="false" :value="100" format="currency">
  <span v-slot:integer="slotProps" styles="font-weight: bold">{{ slotProps.integer }}</span>
</i18n-n>
```

Since Vue I18n v9 or later, you can do the same by omitting the `tag` prop.

Vue I18n v9 or later:

```html
<i18n-n :value="100" format="currency">
  <span v-slot:integer="slotProps" styles="font-weight: bold">{{ slotProps.integer }}</span>
</i18n-n>
```

**Reason**: Since Vue 3 now supports Fragments

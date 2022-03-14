# Migration in Vue 3

## Migration to Composition API from Legacy API

### Summary

Vue I18n supports both styles which are Legacy API mode and Composiyion API mode. Legacy API mode is Options API style, and Composition API mode support Vue Composition API that is able to compose with function.

Legacy API mode is almost compatible with legacy Vue I18n v8.x, making it relatively easy to migrate Vue applications to Vue 3. Vue 3 supports the Options API style, so existing Vue 2 applications will be cases where applications will be migrated to Vue 3.

Vue 3 allows you to make Vue applications using a mix of the Options API style and Composition API style, but Vue I18n has not allowed for a mix of these API styles since the v9 initial release, so you can use either one or the other API style only.

Developing a Vue application with a mix of Options API styles and Compostion API styles is not a desirable software development project from a maintenance standpoint. This is because the cost of maintaining such code is high. However, there are advantages to using both styles. In particular, API style migration is easier to migrate step-by-step, since it works even when implemented in both API styles.

From Vue I18n v9.2, the Legacy API mode can also be used with Composition API mode.

### Limitations

:::warning NOTICE
You should understand as a limited feature for migration.
:::

- The Composition API in Legacy API mode does not support SSR
- If you want to use correctly Vue I18n Composition API (e.g `t`) on `setup` function context directly not `<template>`, you need to call via `nextTick` callback context.

### How to migration

#### `createI18n`

You need specify `allowComposition: true` to `createI18n` otpions. the below example:

```js
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  allowComposition: true, // you need to specify that!
  messages: {
    en: {
      hello: 'hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  }
})

console.log(i18n.allowComposition) // output is true
```

### `useI18n` in Vue Component
#### `setup` option

```vue
<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Hello',
  setup() {
    const { t } = useI18n() // use as global scope
    return { t }
  }
})
</script>

<template>
  <p>{{ $t('hello') }}</p>
  <p>{{ t('hello') }}</p>
</template>
```

#### `<script setup>`

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n() // use as global scope
</script>

<template>
  <p>{{ $t('hello') }}</p>
  <p>{{ t('hello') }}</p>
</template>
```

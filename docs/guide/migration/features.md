# New Features

Vue I18n v9 offers not only Vue 3 support, but this version also is included new features.

## Message format syntax

- See the [Literal interpolation](../essentials/syntax#literal-interpolation)

## Message functions

- See the [Linked messages](../advanced/function#linked-messages)
- See the [Pluralization](../advanced/function#pluralization)

## Composition API

See the [Composition API](../advanced/composition) advanced section

## Translation Component

Support for `plural` prop.
You can specify the number of messages to be pluralized.

The below example:

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      message: {
        plural: 'no bananas | {n} banana | {n} bananas'
      }
    }
  }
})

const count = ref(0)
</script>

<template>
  <i18n-t keypath="message.plural" :plural="count">
    <template #n>
      <b>{{ count }}</b>
    </template>
  </i18n-t>
</template>
```

## DatetimeFormat Component

For Datetime localization, since Vue I18n v9, we also offer the DatetimeFormat component like the [NumberFormat component](../essentials/number#custom-formatting).

See the [Datetime localization custom formatting](../essentials/datetime#custom-formatting)

## i18n Custom Block

- See the [`global` attribute](../advanced/sfc#define-locale-messages-for-global-scope)

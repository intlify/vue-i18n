<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import enUS from './en-US.json'

type MessageSchema = typeof enUS
type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}

/**
 * if you can specify resource schema to type parameter of `useI18n`,
 * you can make to be type-safe the i18n resources.
 */
const { t, n } = useI18n<
  {
    message: MessageSchema
    number: NumberSchema
  },
  'en-US'
>({
  inheritLocale: true,
  messages: {
    'en-US': enUS
  },
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: 'USD'
      }
    }
  }
})
</script>

<template>
  <p>message: {{ t('messages.hello', { name: 'kazupon' }) }}</p>
  <p>currecy: {{ n(1000, 'currency') }}</p>
</template>

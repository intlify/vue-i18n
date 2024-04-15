<script setup lang="ts">
import { useI18n } from 'vue-i18n'
// import schema for global scope
import type { MessageSchema, NumberSchema } from '../locales/schema'

// use global scope
const { t, n } = useI18n<{ message: MessageSchema; number: NumberSchema }>({
  useScope: 'global'
})
</script>

<template>
  <p>message: {{ t('world') }}</p>
  <p>currecy: {{ n(1000, 'currency') }}</p>
</template>

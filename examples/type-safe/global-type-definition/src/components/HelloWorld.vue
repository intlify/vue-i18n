<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// use global scope
const { t, d, n } = useI18n({
  useScope: 'global',
  inheritLocale: true
})
</script>

<template>
  <p>`t` resource key completion: {{ t('menu.login') }}</p>
  <p>`d` resource key completion: {{ d(new Date(), 'short') }}</p>
  <p>`n` resource key completion: {{ n(1000, 'currency') }}</p>
</template>

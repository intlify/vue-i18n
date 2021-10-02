<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true
})
</script>

<template>
  <div>{{ t('title') }}</div>
</template>

<i18n lang="yaml">
en:
  title: Example external component content
ja:
  title: 外部コンポーネントの例
</i18n>

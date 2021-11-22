<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n() // same as `useI18n({ useScope: 'global' })`
</script>

<template>
  <h2>{{ t('pages.home') }}</h2>
</template>

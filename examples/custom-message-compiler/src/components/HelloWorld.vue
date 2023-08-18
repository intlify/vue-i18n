<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>
    <h1>{{ t('hello') }}</h1>
    <h1>{{ t('greeting', { name: 'kazupon' }) }}</h1>
    <h1>{{ t('photo', { numPhotos: 4 }) }}</h1>
  </div>
</template>

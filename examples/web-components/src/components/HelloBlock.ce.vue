<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>

<template>
  <p>{{ t('world') }}</p>
</template>

<i18n>
{
  "en": {
    "world": "The world!"
  },
  "ja": {
    "world": "ザ・ワールド"
  }
}
</i18n>

<template>
  <h1>{{ msg }}</h1>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  async setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    const msg = computed(() => t('pages.about.title'))
    return { msg }
  }
}
</script>

<style scoped>
h1 {
  color: red;
}
</style>

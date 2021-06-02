<template>
  <p>`t` resource key completion: {{ t('menu.login') }}</p>
  <p>`d` resource key completion: {{ d(new Date(), 'short') }}</p>
  <p>`n` resource key completion: {{ n(1000, 'currency') }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    // use global scope
    const { t, d, n } = useI18n({
      inheritLocale: true,
    })
    return { t, d, n }
  }
})
</script>

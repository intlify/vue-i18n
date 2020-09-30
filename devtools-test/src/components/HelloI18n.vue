<template>
  <h1>{{ t('hello') }}</h1>
  <button @click="count++">{{ t('count', { count }) }}</button>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'HelloI18n',
  setup() {
    const count = ref(0)

    // use local composer
    const { t } = useI18n({
      // `locale` inherit from global composer
      inheritLocale: true
    })

    return { count, t }
  }
})
</script>

<i18n>
{
  "en": {
    "hello": "Hello Vue I18n 9.0 🌏!",
    "count": "count is: {count}"
  },
  "ja": {
    "hello": "こんにちは Vue I18n 9.0 🌏！",
    "count": "カウントは{count}です"
  }
}
</i18n>

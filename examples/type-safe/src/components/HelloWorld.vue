<template>
  <h1>{{ t('nest.foo') }}</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

type Schema = {
  hello: string,
  nest: {
    foo: string
  }
}

export default defineComponent({
  name: 'HelloWorld',
  setup: () => {
    /**
     * if you can specify resource schema to type parameter of `useI18n`,
     * you can make to be type-safe the i18n resources.
     */
    const { t } = useI18n<[Schema], 'en'>({
      inheritLocale: true,
      messages: {
        en: {
          nest: {
            foo: 'foo!'
          }
        }
      }
    })
    return { t }
  }
})
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>

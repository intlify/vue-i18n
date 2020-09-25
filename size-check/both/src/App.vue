<template>
  <form>
    <label>{{ $t('language') }}</label>
    <select v-model="$i18n.locale">
      <option value="en">en</option>
      <option value="ja">ja</option>
    </select>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>


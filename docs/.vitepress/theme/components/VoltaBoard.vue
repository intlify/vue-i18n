<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  token: { type: String,
    required: true
  }
})
const src = computed(() => `https://volta.net/embed/${props.token}`)
</script>

<template>
  <iframe :src="src" class="board" />
</template>
      
<style scoped>
.board {
  height: calc(100vh/1.5);
  width: 100%;
}
</style>
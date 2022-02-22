<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'service',

  props: {
    title: {
      type: String,
      requried: true
    },

    link: {
      type: String
    },

    source: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    }
  }
})
</script>

<template>
  <h2>{{ title }}</h2>
  <a :href="link" class="base" target="_blank" rel="noopener">
    <img class="banner" :alt="title" :src="source" />
  </a>
  <p>{{ description }}</p>
  <br />
  <a class="become-a-sponsor" href="https://github.com/sponsors/kazupon" target="_blank" rel="noopener">Become a sponsor on GitHub</a>
</template>

<style scoped>
.base {
  margin: 1rem 1rem 0 1rem;
  height: auto;
  display: inline-block;
  vertical-align: middle;
  width: 15rem;
}
.banner {
  max-width: 100%;
  vertical-align: midele;
}
</style>

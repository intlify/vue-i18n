<script setup lang="ts">
import Sponsor from './components/Sponsor.vue'
import { sponsors } from './sponsor'

const platinums = sponsors.platinums
</script>

<template>
  <div class="sponsors-sidebar">
    <a
      v-for="platinum in platinums"
      :href="platinum.link"
      :key="platinum.link"
      target="_blank"
      rel="noopener"
    >
      <img :src="platinum.source" :alt="platinum.name" />
    </a>
  </div>
</template>

<style>
.sponsors-sidebar {
  padding: 1rem 1.5rem 0;
  font-size: 0.8rem;
}
.sponsors-sidebar a {
  color: #999;
}
.sponsors-sidebar img {
  max-width: 200px;
  max-height: 40px;
  display: block;
  margin: 1.25rem 0;
}
</style>

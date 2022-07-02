<script setup lang="ts">
import { VPHomeSponsors } from 'vitepress/theme'
import { useSponsor } from '../composables/sponsor'
const { data } = useSponsor()
</script>

<template>
  <VPHomeSponsors
    v-if="data"
    message="Vue I18n is free and open source, made possible by wonderful sponsors."
    action-text="Become a sponsor"
    action-link="https://github.com/sponsors/kazupon"
    :data="data"
  />
</template>
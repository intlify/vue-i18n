<script setup lang="ts">
import { computed } from 'vue'
import { VPDocAsideSponsors } from 'vitepress/theme'
import { useSponsor } from '../composables/sponsor'
const { data } = useSponsor()
const sponsors = computed(() => {
  return (
    data?.value.filter((sponsor) => {
      return sponsor.size === 'big'
    }).map((sponsor) => {
      return {
        size: sponsor.size === 'big' ? 'mini' : 'xmini',
        items: sponsor.items
      }
    }) ?? []
  )
})
</script>

<template>
  <VPDocAsideSponsors v-if="data" :data="sponsors" />
</template>
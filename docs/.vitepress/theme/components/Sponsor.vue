<script lang="ts">
import { TierLevel } from '../state'
import { defineComponent } from 'vue'

const TIER_CLASSES = ['platinum', 'gold', 'silver', 'bronze'] as const

export default defineComponent({
  name: 'Sponsor',

  props: {
    name: {
      type: String,
      requried: true
    },

    tier: {
      type: Number,
      default: (): number => TierLevel.Bronze,
      validate: (level: number) => [TierLevel.Platinum, TierLevel.Gold, TierLevel.Silver, TierLevel.Bronze].includes(level)
    },

    link: {
      type: String
    },

    source: {
      type: String,
      required: true
    }
  },

  setup(props) {
    return {
      tierClass: TIER_CLASSES[props.tier]
    }
  }
})
</script>

<template>
  <a :href="link" class="base" target="_blank" rel="noopener">
    <img class="banner" :class="[tierClass]" :alt="name" :src="source" />
  </a>
</template>

<style scoped>
.base {
  margin: 1rem 1rem 0 1rem;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}
.platinum {
  width: 30rem;
}
.gold {
  width: 15rem;
}
.silver {
  width: 12.5rem;
}
.bronze {
  width: 9rem;
}
.banner {
  max-width: 100%;
  vertical-align: midele;
}
</style>

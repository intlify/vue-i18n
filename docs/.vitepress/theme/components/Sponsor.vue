<script lang="ts">
import { TierLevel } from '../state'
import { defineComponent } from 'vue'

const TIER_CLASSES = ['gold', 'silver', 'bronze'] as const

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
      validate: (level: number) => [TierLevel.Gold, TierLevel.Silver, TierLevel.Bronze].includes(level)
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
  <a :href="link" :class="[tierClass]" class="base" target="_blank" rel="noopener">
    <img :alt="name" :src="source" :class="[tierClass]" class="base" />
  </a>
</template>

<style scoped>
.base {
  display: inline-block;
  vertical-align: middle;
}
.gold {
  width: 440px;
}
.sliver {
  width: 320px;
}
.bronze {
  width: 200px;
}
</style>

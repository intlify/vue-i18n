<script lang="ts">
import { defineComponent } from 'vue'

const TIER_CLASSES = ['platinum', 'special', 'gold', 'silver', 'bronze'] as const

export default defineComponent({
  name: 'Sponsor',

  props: {
    name: {
      type: String,
      requried: true
    },

    tier: {
      type: String,
      default: (): string => 'bronze',
      validate: (level: string) => ~TIER_CLASSES.indexOf(level)
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
      tierClass: props.tier
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
.special {
  width: 15rem;
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

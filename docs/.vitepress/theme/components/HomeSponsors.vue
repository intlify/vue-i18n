<script lang="ts">
import { defineComponent } from 'vue'
import Sponsor from './Sponsor.vue'
import { sponsors } from '../sponsor'

export default defineComponent({
  name: 'HomeSponspors',

  components: {
    Sponsor
  },

  setup() {
    return { ...sponsors }
  }
})
</script>

<template>
  <div class="sponsors">
    <h3 class="frontpage">Sponsors</h3>
    <div class="level">
      <h4 class="sponsor-title">🏅 Platinum Sponsors</h4>
      <Sponsor v-for="platinum in platinums" v-bind="platinum" />
    </div>
    <div class="level">
      <h4 class="sponsor-title">✨ Special Sponsors</h4>
      <Sponsor v-for="special in specials" v-bind="special" />
    </div>
    <div class="level">
      <h4 class="sponsor-title">🥇 Gold Sponsors</h4>
      <Sponsor v-for="gold in golds" v-bind="gold" />
    </div>
    <div class="level">
      <h4 class="sponsor-title">🥈 Silver Sponsors</h4>
      <Sponsor v-for="silver in silvers" v-bind="silver" />
    </div>
    <div class="level">
      <h4 class="sponsor-title">🥉 Bronze Sponsors</h4>
      <Sponsor v-for="bronze in bronzes" v-bind="bronze" />
    </div>
    <a class="become-a-sponsor" href="https://github.com/sponsors/kazupon" target="_blank" rel="noopener">Become a sponsor on GitHub</a>
  </div>
</template>

<style scoped>
.sponsors {
  text-align:center;
  padding: 24px 0 24px 0;
}
.sponsors .frontpage {
  font-size: 1.2rem;
  border: none;
}
.sponsors .become-a-sponsor {
  color: #999;
  margin: 1em;
  display: block;
}
.sponsors .level {
  padding: 24px 0 0 0;
}
.sponsor-title {
  padding: 12px 0;
}
</style>

<script>
import DefaultTheme from 'vitepress/dist/client/theme-default'
import Sponsor from './components/Sponsor.vue'
import AlgoliaSearchBox from './components/AlgoliaSearchBox.vue'
import { sponsors } from './state'

export default {
  name: 'Layout',

  components: {
    ParentLayout: DefaultTheme.Layout,
    AlgoliaSearchBox,
    Sponsor
  },

  setup() {
    return { ...sponsors }
  }
}
</script>

<template>
  <ParentLayout>
    <template #navbar-search>
      <AlgoliaSearchBox :options="$site.themeConfig.algolia" />
    </template>
    <template #home-hero>
      <div class="sponsors">
        <div class="level">
          <h4>🥈 Silver Sponsors</h4>
          <Sponsor v-for="silver in silvers" v-bind="silver" />
        </div>
        <div class="level">
          <h4 class="sponsor-title">🥉 Bronze Sponsors</h4>
          <Sponsor v-for="bronze in bronzes" v-bind="bronze" />
        </div>
      </div>
    </template>
    <template #home-featuers>
    </template>
    <template #home-footer>
    </template>
  </ParentLayout>
</template>

<style>
form {
  margin-block-end: 0;
}
.sponsors {
  text-align:center;
  padding: 24px 0 24px 0;
}
.sponsors .level {
  padding: 24px 0 0 0;
}
.sponsor-title {
  padding: 12px 0 0 0;
}
.hero .action .nav-item {
  margin-left: 0;
}
</style>

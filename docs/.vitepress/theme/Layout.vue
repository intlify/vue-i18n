<script>
import DefaultTheme from 'vitepress/dist/client/theme-default'
import Sponsor from './components/Sponsor.vue'
import { sponsors } from './state'

export default {
  name: 'Layout',

  components: {
    ParentLayout: DefaultTheme.Layout,
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
    </template>
    <template #sidebar-top>
      <div class="sponsors-sidebar">
        <a
          href="https://github.com/sponsors/kazupon"
          target="_blank"
          rel="noopener"
          >Platinum Sponsors</a
        >

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
    <template #home-hero>
      <div class="sponsors">
        <div class="level">
          <h4 class="sponsor-title">🏅 Platinum Sponsors</h4>
          <Sponsor v-for="platinum in platinums" v-bind="platinum" />
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
  padding: 12px 0;
}
.hero .action .nav-item {
  margin-left: 0;
}
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

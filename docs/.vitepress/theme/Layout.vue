<script>
import DefaultTheme from 'vitepress/dist/client/theme-default'
import Sponsor from './components/Sponsor.vue'
import { TierLevel } from './components/constants'

export default {
  name: 'Layout',

  components: {
    ParentLayout: DefaultTheme.Layout,
    Sponsor
  },

  setup() {
    return {
      silvers: [{
        name: 'Babel Edit',
        tier: TierLevel.Silver,
        link: 'https://www.codeandweb.com/babeledit?utm_campaign=vue-i18n-2019-01',
        source: '/babeledit.png'
      }],
      bronzes: [{
        name: 'Zen Architects',
        tier: TierLevel.Bronze,
        link: 'https://zenarchitects.co.jp/',
        source: '/zenarchitects.png'
      }, {
        name: 'SendCloud',
        tier: TierLevel.Bronze,
        link: 'https://www.sendcloud.com/',
        source: '/sendcloud.svg'
      }]
    }
  }
}
</script>

<template>
  <ParentLayout>
    <template #home-hero>
      <div class="sponsors">
        <h4>🥈 Silver Sponsors</h4>
        <Sponsor v-for="silver in silvers" v-bind="silver" />
        <h4 class="title">🥉 Bronze Sponsors</h4>
        <Sponsor v-for="bronze in bronzes" v-bind="bronze" />
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
.title {
  padding: 12px 0 0 0;
}
</style>

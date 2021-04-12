import { h, watch } from 'vue'
import DefaultTheme from 'vitepress/dist/client/theme-default'
import Layout from './Layout.vue'
import Sponsor from './components/Sponsor.vue'
import { sponsors } from './state'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('GoldSponsors', () => sponsors.golds.map(prop => h(Sponsor, prop)))
    app.component('SilverSponsors', () => sponsors.silvers.map(prop => h(Sponsor, prop)))
    app.component('BronzeSponsors', () => sponsors.bronzes.map(prop => h(Sponsor, prop)))
    // test
    // app is the Vue 3 app instance from createApp()
    // router is VitePress' custom router (see `lib/app/router.js`)
    // siteData is a ref of current site-level metadata.
  },
}

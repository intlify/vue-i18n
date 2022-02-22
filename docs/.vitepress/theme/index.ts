import { h } from 'vue'
import DefaultTheme from 'vitepress/dist/client/theme-default'
import Layout from './Layout.vue'
import Sponsor from './components/Sponsor.vue'
import Service from './components/Service.vue'
import { sponsors } from './sponsor'
import { integrations } from './integrations'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('PlatinumSponsors', () => sponsors.platinums.map(prop => h(Sponsor, prop)))
    app.component('SpecialSponsors', () => sponsors.specials.map(prop => h(Sponsor, prop)))
    app.component('GoldSponsors', () => sponsors.golds.map(prop => h(Sponsor, prop)))
    app.component('SilverSponsors', () => sponsors.silvers.map(prop => h(Sponsor, prop)))
    app.component('BronzeSponsors', () => sponsors.bronzes.map(prop => h(Sponsor, prop)))
    app.component('IntegrationServices', () => integrations.map(prop => h(Service, prop)))
    // test
    // app is the Vue 3 app instance from createApp()
    // router is VitePress' custom router (see `lib/app/router.js`)
    // siteData is a ref of current site-level metadata.
  },
}

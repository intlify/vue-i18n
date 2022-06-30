import { h } from 'vue'
import Theme from 'vitepress/theme'
import Sponsor from './components/Sponsor.vue'
import Service from './components/Service.vue'
import { sponsors } from './sponsor'
import { integrations } from './integrations'
import './style.css'

export default {
  ...Theme,
  // Layout() {
  //   return h(Theme.Layout, null, {
  //     'home-features-after': () => h(Home),
  //   })
  // },
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

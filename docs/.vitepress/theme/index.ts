import { h } from 'vue'
import Theme from 'vitepress/theme'
import HomeSponsors from './components/HomeSponsors.vue'
import AsideSponsors from './components/AsideSponsors.vue'
import Service from './components/Service.vue'
import VoltaBoard from './components/VoltaBoard.vue'
import { integrations } from './integrations'
import './styles/global.css'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(HomeSponsors),
      'aside-ads-before': () => h(AsideSponsors)
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('IntegrationServices', () => integrations.map(prop => h(Service, prop)))
    app.component('VoltaBoard', VoltaBoard)
  },
}

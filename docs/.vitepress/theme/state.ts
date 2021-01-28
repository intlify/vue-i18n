export const enum TierLevel {
  Gold = 0,
  Silver,
  Bronze
}

export const sponsors = {
  golds: [{
    name: 'NuxtJS',
    tier: TierLevel.Gold,
    link: 'https://nuxtjs.org/',
    source: '/nuxt.png'
  }],
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
    source: '/sendcloud.png'
  }, {
    name: 'Vue Mastery',
    tier: TierLevel.Bronze,
    link: 'https://www.vuemastery.com/',
    source: '/vuemastery.png'
  }]
} as const

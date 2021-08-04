export const enum TierLevel {
  Platinum = 0,
  Gold,
  Silver,
  Bronze
}

export const sponsors = {
  platinums: [{
    name: 'Zen Architects',
    tier: TierLevel.Platinum,
    link: 'https://zenarchitects.co.jp/',
    source: '/zenarchitects.png'
  }],
  golds: [{
    name: 'NuxtJS',
    tier: TierLevel.Gold,
    link: 'https://nuxtjs.org/',
    source: '/nuxt.png'
  }, {
    name: 'RapidAPI',
    tier: TierLevel.Gold,
    link: 'https://rapidapi.com/',
    source: '/RapidAPI.svg'
  }],
  silvers: [],
  bronzes: [{
    name: 'SendCloud',
    tier: TierLevel.Bronze,
    link: 'https://www.sendcloud.com/',
    source: '/sendcloud.png'
  }, {
    name: 'Vue Mastery',
    tier: TierLevel.Bronze,
    link: 'https://www.vuemastery.com/',
    source: '/vuemastery.png'
  }, {
    name: 'DECIBEL',
    tier: TierLevel.Bronze,
    link: 'https://www.deci-bel.com/',
    source: '/decibel.png'
  }]
} as const

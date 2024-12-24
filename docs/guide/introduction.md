<script setup lang="ts">
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/kazupon.png',
    name: "kazupon",
    title: 'Creator of Vue I18n & Intlify project',
    sponsor: 'https://github.com/sponsors/kazupon',
    links: [
      { icon: 'github', link: 'https://github.com/kazupon' },
      { icon: 'twitter', link: 'https://twitter.com/kazu_pon' }
    ]
  },
  {
    avatar: 'https://www.github.com/BobbieGoede.png',
    name: "BobbieGoede",
    title: 'Intlify Core member',
    sponsor: 'https://github.com/sponsors/BobbieGoede',
    links: [
      { icon: 'github', link: 'https://github.com/BobbieGoede' },
      { icon: 'twitter', link: 'https://twitter.com/BobbieGoede' }
    ]
  },
  {
    avatar: 'https://www.github.com/ota-meshi.png',
    name: "Yosuke Ota",
    title: 'Intlify Core member',
    sponsor: 'https://github.com/sponsors/ota-meshi',
    links: [
      { icon: 'github', link: 'https://github.com/ota-meshi' },
      { icon: 'twitter', link: 'https://twitter.com/omoteota' }
    ]
  }
]
</script>

# What is Vue I18n?

:::tip NOTE
If you would like to know more about the maintenance status of each version of Vue I18n, please see [here](./maintenance).
:::

Vue I18n is internationalization plugin of Vue.js. And that is one of [Intlify projects](https://intlify.dev/). It easily integrates some localization features to your Vue.js Application.

Go to [Installation](./installation)


## Meet the team

<VPTeamMembers size="small" :members="members" />

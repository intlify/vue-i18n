<script setup lang="ts">
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/kazupon.png',
    name: "kazupon",
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/kazupon' },
      { icon: 'twitter', link: 'https://twitter.com/kazu_pon' }
    ]
  }
]
</script>

# What is Vue I18n?

:::tip NOTE
Already know Vue I18n v8.x and just want to learn about what’s new in Vue I18n v9? Check out the [Migration Guide](./migration/breaking)!
:::

Vue I18n is internationalization plugin of Vue.js. It easily integrates some localization features to your Vue.js Application.

Go to [Installation](./installation)


## Meet the team

<VPTeamMembers size="small" :members="members" />

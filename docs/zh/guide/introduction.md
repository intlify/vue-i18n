<script setup lang="ts">
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/kazupon.png',
    name: "kazupon",
    title: 'Vue I18n & Intlify 项目创建者',
    sponsor: 'https://github.com/sponsors/kazupon',
    links: [
      { icon: 'github', link: 'https://github.com/kazupon' },
      { icon: 'twitter', link: 'https://twitter.com/kazu_pon' }
    ]
  },
  {
    avatar: 'https://www.github.com/BobbieGoede.png',
    name: "BobbieGoede",
    title: 'Intlify 核心成员',
    sponsor: 'https://github.com/sponsors/BobbieGoede',
    links: [
      { icon: 'github', link: 'https://github.com/BobbieGoede' },
      { icon: 'twitter', link: 'https://twitter.com/BobbieGoede' }
    ]
  },
  {
    avatar: 'https://www.github.com/ota-meshi.png',
    name: "Yosuke Ota",
    title: 'Intlify 核心成员',
    sponsor: 'https://github.com/sponsors/ota-meshi',
    links: [
      { icon: 'github', link: 'https://github.com/ota-meshi' },
      { icon: 'twitter', link: 'https://twitter.com/omoteota' }
    ]
  }
]
</script>

# 什么是 Vue I18n？

:::tip 注意
如果你想了解 Vue I18n 各版本的维护状态，请查看 [这里](./maintenance)。
:::

Vue I18n 是 Vue.js 的国际化插件，也是 [Intlify 项目](https://intlify.dev/) 的一部分。它可以轻松地将本地化功能集成到你的 Vue.js 应用程序中。

前往 [安装](./installation)

## 团队成员

<VPTeamMembers size="small" :members="members" />

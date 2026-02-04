<script setup lang="ts">
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/kazupon.png',
    name: "kazupon",
    title: 'Vue I18n & Intlify プロジェクトの作成者',
    sponsor: 'https://github.com/sponsors/kazupon',
    links: [
      { icon: 'github', link: 'https://github.com/kazupon' },
      { icon: 'twitter', link: 'https://twitter.com/kazu_pon' }
    ]
  },
  {
    avatar: 'https://www.github.com/BobbieGoede.png',
    name: "BobbieGoede",
    title: 'Intlify コアメンバー',
    sponsor: 'https://github.com/sponsors/BobbieGoede',
    links: [
      { icon: 'github', link: 'https://github.com/BobbieGoede' },
      { icon: 'twitter', link: 'https://twitter.com/BobbieGoede' }
    ]
  },
  {
    avatar: 'https://www.github.com/ota-meshi.png',
    name: "Yosuke Ota",
    title: 'Intlify コアメンバー',
    sponsor: 'https://github.com/sponsors/ota-meshi',
    links: [
      { icon: 'github', link: 'https://github.com/ota-meshi' },
      { icon: 'twitter', link: 'https://twitter.com/omoteota' }
    ]
  }
]
</script>

# Vue I18n とは？

:::tip NOTE
Vue I18n の各バージョンのメンテナンス状況について詳しく知りたい場合は、[こちら](./maintenance) をご覧ください。
:::

Vue I18n は Vue.js の国際化プラグインであり、[Intlify プロジェクト](https://intlify.dev/) の一部です。Vue.js アプリケーションにローカリゼーション機能を簡単に統合できます。

[インストール](./installation) へ移動

## チーム紹介

<VPTeamMembers size="small" :members="members" />

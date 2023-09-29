import { defineConfig } from 'vitepress'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      vueI18n({
        ssr: true
      })
    ]
  },
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

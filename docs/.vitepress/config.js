/** @typedef {import('vitepress').UserConfig} UserConfig */

/** @type {UserConfig['head']} */
const head = []

/** @type {UserConfig} */
const config = {
  lang: 'en-US',
  title: 'Vue I18n',
  description: 'Vue I18n is internationalization plugin for Vue.js',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue I18n',
      description: 'Vue I18n is internationalization plugin for Vue.js',
    }
  },
  head,
  // serviceWorker: true,
  themeConfig: {
    repo: 'intlify/vue-i18n-next',
    docsRepo: 'intlify/vue-i18n-next',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    locales: {
      '/': { // english
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'API Reference',
            link: '/api/'
          },
          {
            text: 'Changelog',
            link: 'https://github.com/intlify/vue-i18n-next/blob/master/CHANGELOG.md'
          }
        ],
        sidebar: [
          {
            text: 'Introduction',
            link: '/introduction',
          },
          {
            text: 'Getting Starrted',
            link: '/started',
          },
          {
            text: 'Installation',
            link: '/installation',
          }
        ]
      }
    }
  }
}

module.exports = config

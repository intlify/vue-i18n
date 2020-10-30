const { readdirSync } = require('fs')
const { resolve, basename } = require('path')

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
      // default english
      '/': {
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
        sidebar: {
          '/guide/': [
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
            },
          ],
          '/api/': getSidebarApi('vue-i18n'),
        }
      }
    }
  }
}

function getSidebarApi(target) {
  const API_TITLE_MAPS = {
    function: 'Functions',
    interface: 'Interfaces',
    typealias: 'Type Aliases',
    variable: 'Variables',
    class: 'Classes'
  }
  return readdirSync(resolve(__dirname, '../api'))
    .map(file => basename(file, '.md'))
    .filter(file => file.includes(target))
    .map(file => {
      return {
        text: API_TITLE_MAPS[file.split('-').pop()],
        link: `/api/${file}`
      }
    })
}

module.exports = config

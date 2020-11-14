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
            link: '/essentials/started'
          },
          {
            text: 'API Reference',
            link: '/api/'
          },
          {
            text: 'Chnagelog',
            link: 'https://github.com/intlify/vue-i18n-next/blob/master/CHANGELOG.md'
          }
        ],
        sidebar: {
          '/': [
            {
              text: 'Introduction',
              link: '/introduction'
            },
            {
              text: 'Installation',
              link: '/installation',
            },
            {
              text: 'Essentials',
              collapsable: false,
              children: [
                {
                  text: 'Getting Started',
                  link: '/essentials/started',
                },
                {
                  text: 'Message Format Syntax',
                  link: '/essentials/syntax',
                },
                {
                  text: 'Pluralization',
                  link: '/essentials/pluralization'
                },
                {
                  text: 'DateTime Localization',
                  link: '/essentials/datetime'
                },
                {
                  text: 'Number Localization',
                  link: '/essentials/number'
                },
                {
                  text: 'Scope and Locale Changing',
                  link: '/essentials/scope'
                },
                {
                  text: 'Fallback Localization',
                  link: '/essentials/fallback'
                },
                {
                  text: 'Local Scope Based Localization',
                  link: '/essentials/local'
                }
              ]
            },
            {
              text: 'Advanced',
              collapsable: false,
              children: [
                {
                  text: 'Custom Directive Localization',
                  link: '/advanced/directive'
                },
                {
                  text: 'Component Interpolation',
                  link: '/advanced/component'
                },
                {
                  text: 'Single File Components',
                  link: '/advanced/sfc'
                },
                {
                  text: 'Lazy Loading',
                  link: '/advanced/lazy'
                },
                {
                  text: 'Message Functions',
                  link: '/advanced/function'
                },
                {
                  text: 'Composition API',
                  link: '/advanced/composition',
                }
              ]
            },
            {
              text: 'Migration from Vue 2',
              collapsable: false,
              children: [
                {
                  text: 'Breaking Changes',
                  link: '/migration/breaking'
                },
                {
                  text: 'New Features',
                  link: '/migration/features'
                },
              ]
            }
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

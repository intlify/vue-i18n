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
    algolia: {
      apiKey: '9831550d7a35015b79c75e40c9b6237d',
      indexName: 'docs',
      algoliaOptions: { facetFilters: ['guide:essentials,guide:advanced,guide:migration,api'] },
    },
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
            link: '/api/general'
          },
          {
            text: 'Ecosystem',
            items: [
              {
                text: 'Official Tooling',
                items: [
                  // {
                  //   text: 'Vue CLI Plugin',
                  //   link: 'https://github.com/kazupon/vue-cli-plugin-i18n'
                  // },
                  {
                    text: 'Webpack Loader',
                    link: 'https://github.com/intlify/vue-i18n-loader'
                  },
                  {
                    text: 'Rollup Plugin',
                    link: 'https://github.com/intlify/rollup-plugin-vue-i18n'
                  },
                  {
                    text: 'Vite Plugin',
                    link: 'https://github.com/intlify/vite-plugin-vue-i18n'
                  },
                  {
                    text: 'ESLint Plugin',
                    link: 'https://intlify.github.io/eslint-plugin-vue-i18n/'
                  },
                  {
                    text: 'Extensions',
                    link: 'https://github.com/kazupon/vue-i18n-extensions'
                  }
                ]
              },
              {
                text: '3rd Party Tooling',
                items: [
                  {
                    text: 'BabelEdit',
                    link: 'https://www.codeandweb.com/babeledit?utm_campaign=vue-i18n-2019-01'
                  },
                  {
                    text: 'i18n Ally',
                    link: 'https://marketplace.visualstudio.com/items?itemName=antfu.i18n-ally'
                  }
                ]
              }
            ]
          },
          {
            text: 'Changelog',
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
                  text: 'Datetime Formatting',
                  link: '/essentials/datetime'
                },
                {
                  text: 'Number Formatting',
                  link: '/essentials/number'
                },
                {
                  text: 'Scope and Locale Changing',
                  link: '/essentials/scope'
                },
                {
                  text: 'Fallbacking',
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
                  text: 'Custom Directive',
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
                },
                {
                  text: 'Optimaization',
                  link: '/advanced/optimaization',
                }
              ]
            },
            {
              text: 'Tooling',
              link: '/tooling'
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
                {
                  text: 'Compostion API for Vue 2',
                  link: '/migration/composition'
                }
              ]
            },
            {
              text: 'Documentation for v8.x',
              link: '/v8-docs',
            },
          ],
          '/api/': [
            {
              text: 'General',
              link: '/api/general'
            },
            {
              text: 'Legacy API',
              link: '/api/legacy'
            },
            {
              text: 'Composition API',
              link: '/api/composition'
            },
            {
              text: 'Components',
              link: '/api/component'
            },
            {
              text: 'Directives',
              link: '/api/directive'
            },
            {
              text: 'Component Injections',
              link: '/api/injection'
            }
          ]
        }
      }
    }
  }
}

module.exports = config

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
            link: '/api/general'
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
              text: 'Coomponents',
              link: '/api/component'
            },
            {
              text: 'Directives',
              link: '/api/directive'
            }
          ]
        }
      }
    }
  }
}

module.exports = config

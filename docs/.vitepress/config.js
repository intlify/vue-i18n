/** @typedef {import('vitepress').UserConfig} UserConfig */

/** @type {UserConfig['head']} */
const head = []

if (process.env.NODE_ENV === 'production') {
  head.push([
    'script',
    {
      src: 'https://unpkg.com/thesemetrics@latest',
      async: ''
    }
  ])
}

/** @type {UserConfig} */
const config = {
  title: 'Vue I18n',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue I18n',
      description: 'Vue I18n is internationalization plugin for Vue.js'
    },
    '/ja/': {
      lang: 'ja-JP',
      title: 'Vue I18n',
      description: 'Vue I18nはVue.jsの国際化プラグインです'
    },
  },
  head,
  // serviceWorker: true,
  themeConfig: {
    repo: 'intlify/vue-i18n-next',
    docsRepo: 'intlify/vue-i18n-next',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,

    carbonAds: {
      carbon: 'CEAIC53M',
      placement: 'kazupongithubio',
    },

    algolia: {
      apiKey: '3a9e93ba1069de0ece2ae100daf8f6ea',
      indexName: 'vue-i18n',
      algoliaOptions: { facetFilters: ['tags:guide,api'] }
    },

    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'API Reference',
            link: '/api/general'
          },
          {
            text: 'Ecosystem',
            link: '/ecosystem/official'
          },
          {
            text: 'v9.x',
            items: [{ text: 'v8.x', link: 'https://kazupon.github.io/vue-i18n/' }],
          },
          {
            text: 'Changelog',
            link: 'https://github.com/intlify/vue-i18n-next/blob/master/CHANGELOG.md'
          }
        ],
        sidebar: {
          '/ecosystem/': [
            {
              text: 'Official Tooling',
              link: '/ecosystem/official'
            },
            {
              text: '3rd Party Integrations',
              link: '/ecosystem/integrations'
            },
            {
              text: '3rd Party Tooling',
              link: '/ecosystem/tools'
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
          ],
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
                  link: '/guide/',
                },
                {
                  text: 'Message Format Syntax',
                  link: '/guide/essentials/syntax',
                },
                {
                  text: 'Pluralization',
                  link: '/guide/essentials/pluralization'
                },
                {
                  text: 'Datetime Formatting',
                  link: '/guide/essentials/datetime'
                },
                {
                  text: 'Number Formatting',
                  link: '/guide/essentials/number'
                },
                {
                  text: 'Scope and Locale Changing',
                  link: '/guide/essentials/scope'
                },
                {
                  text: 'Fallbacking',
                  link: '/guide/essentials/fallback'
                },
                {
                  text: 'Local Scope Based Localization',
                  link: '/guide/essentials/local'
                }
              ]
            },
            {
              text: 'Advanced',
              collapsable: false,
              children: [
                {
                  text: 'Custom Directive',
                  link: '/guide/advanced/directive'
                },
                {
                  text: 'Component Interpolation',
                  link: '/guide/advanced/component'
                },
                {
                  text: 'Single File Components',
                  link: '/guide/advanced/sfc'
                },
                {
                  text: 'Lazy Loading',
                  link: '/guide/advanced/lazy'
                },
                {
                  text: 'Message Functions',
                  link: '/guide/advanced/function'
                },
                {
                  text: 'Composition API',
                  link: '/guide/advanced/composition',
                },
                {
                  text: 'TypeScript Support',
                  link: '/guide/advanced/typescript',
                },
                {
                  text: 'Web components',
                  link: '/guide/advanced/wc',
                },
                {
                  text: 'Optimization',
                  link: '/guide/advanced/optimization',
                }
              ]
            },
            {
              text: 'Migrations',
              collapsable: false,
              children: [
                {
                  text: 'Breaking Changes',
                  link: '/guide/migration/breaking'
                },
                {
                  text: 'New Features',
                  link: '/guide/migration/features'
                },
                {
                  text: 'Migration from Vue 2',
                  link: '/guide/migration/vue2'
                },
                {
                  text: 'Migration in Vue 3',
                  link: '/guide/migration/vue3'
                }
              ]
            },
            {
              text: 'Documentation for v8.x',
              link: '/v8-docs',
            },
          ]
        }
      },
      '/ja/': {
        label: '日本語',
        selectText: '言語',
        ariaLabel: '言語',
        editLinkText: 'GitHubでこのページを編集する',
        lastUpdated: '最終更新',
        nav: [
          {
            text: 'ガイド',
            link: '/ja/guide/'
          },
          {
            text: 'API リファレンス',
            link: '/ja/api/general'
          },
          {
            text: 'エコシステム',
            link: '/ja/ecosystem/official'
          },
          {
            text: 'v9.x',
            items: [{ text: 'v8.x', link: 'https://kazupon.github.io/vue-i18n/' }],
          },
          {
            text: '変更ログ',
            link: 'https://github.com/intlify/vue-i18n-next/blob/master/CHANGELOG.md'
          }
        ],
        sidebar: {
          '/ja/ecosystem/': [
            {
              text: 'Official Tooling',
              link: '/ja/ecosystem/official'
            },
            {
              text: '3rd Party Integrations',
              link: '/ja/ecosystem/integrations'
            },
            {
              text: '3rd Party Tooling',
              link: '/ja/ecosystem/tools'
            },
          ],
          '/ja/api/': [
            {
              text: 'General',
              link: '/ja/api/general'
            },
            {
              text: 'Legacy API',
              link: '/ja/api/legacy'
            },
            {
              text: 'Composition API',
              link: '/ja/api/composition'
            },
            {
              text: 'Components',
              link: '/ja/api/component'
            },
            {
              text: 'Directives',
              link: '/ja/api/directive'
            },
            {
              text: 'Component Injections',
              link: '/ja/api/injection'
            }
          ],
          '/ja/': [
            {
              text: 'イントロダクション',
              link: '/ja/introduction'
            },
            {
              text: 'インストール',
              link: '/ja/installation',
            },
            {
              text: 'エッセンシャル',
              collapsable: false,
              children: [
                {
                  text: 'はじめよう',
                  link: '/ja/guide/',
                },
                {
                  text: 'メッセージフォーマット構文',
                  link: '/ja/guide/essentials/syntax',
                },
                {
                  text: '複数化',
                  link: '/ja/guide/essentials/pluralization'
                },
                {
                  text: '日時フォーマット',
                  link: '/ja/guide/essentials/datetime'
                },
                {
                  text: '数フォーマット',
                  link: '/ja/guide/essentials/number'
                },
                {
                  text: 'スコープとロケールの変更',
                  link: '/ja/guide/essentials/scope'
                },
                {
                  text: 'フォールバック',
                  link: '/ja/guide/essentials/fallback'
                },
                {
                  text: 'ローカルスコープベースのローカライゼーション',
                  link: '/ja/guide/essentials/local'
                }
              ]
            },
            {
              text: 'Advanced',
              collapsable: false,
              children: [
                {
                  text: 'Custom Directive',
                  link: '/ja/guide/advanced/directive'
                },
                {
                  text: 'Component Interpolation',
                  link: '/ja/guide/advanced/component'
                },
                {
                  text: 'Single File Components',
                  link: '/ja/guide/advanced/sfc'
                },
                {
                  text: 'Lazy Loading',
                  link: '/ja/guide/advanced/lazy'
                },
                {
                  text: 'Message Functions',
                  link: '/ja/guide/advanced/function'
                },
                {
                  text: 'Composition API',
                  link: '/ja/guide/advanced/composition',
                },
                {
                  text: 'TypeScript Support',
                  link: '/ja/guide/advanced/typescript',
                },
                {
                  text: 'Web components',
                  link: '/ja/guide/advanced/wc',
                },
                {
                  text: 'Optimization',
                  link: '/ja/guide/advanced/optimization',
                }
              ]
            },
            {
              text: 'Migrations',
              collapsable: false,
              children: [
                {
                  text: 'Breaking Changes',
                  link: '/ja/guide/migration/breaking'
                },
                {
                  text: 'New Features',
                  link: '/ja/guide/migration/features'
                },
                {
                  text: 'Migration from Vue 2',
                  link: '/guide/migration/vue2'
                },
                {
                  text: 'Migration in Vue 3',
                  link: '/guide/migration/vue3'
                }
              ]
            },
            {
              text: 'Documentation for v8.x',
              link: '/ja/v8-docs',
            },
          ]
        }
      },
    },

  }
}

module.exports = config

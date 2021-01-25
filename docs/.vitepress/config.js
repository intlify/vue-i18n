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
  lang: 'en-US',
  title: 'Vue I18n',
  description: 'Vue I18n is internationalization plugin for Vue.js',
  head,
  // serviceWorker: true,
  themeConfig: {
    repo: 'intlify/vue-i18n-next',
    docsRepo: 'intlify/vue-i18n-next',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,

    algolia: {
      apiKey: '3a9e93ba1069de0ece2ae100daf8f6ea',
      indexName: 'vue-i18n',
      algoliaOptions: { facetFilters: ['type:$TYPE'] },
    },

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
          text: '3rd Party Tooling',
          link: '/ecosystem/third'
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
              text: 'Optimization',
              link: '/guide/advanced/optimization',
            }
          ]
        },
        {
          text: 'Migration from Vue 2',
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
              text: 'Compostion API for Vue 2',
              link: '/guide/migration/composition'
            }
          ]
        },
        {
          text: 'Documentation for v8.x',
          link: '/v8-docs',
        },
      ]
    }
  }
}

module.exports = config

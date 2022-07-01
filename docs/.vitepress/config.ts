import { defineConfig } from 'vitepress'
import type { HeadConfig } from 'vitepress'

const head: HeadConfig[] = []

if (process.env.NODE_ENV === 'production') {
  head.push([
    'script',
    {
      src: 'https://unpkg.com/thesemetrics@latest',
      async: ''
    }
  ])
}

export default defineConfig({
  title: 'Vue I18n',
  description: 'Internationalization plugin for Vue.js',

  lang: 'en-US',
  lastUpdated: true,
  head,

  markdown: { attrs: { disable: true } },

  themeConfig: {
    logo: '/vue-i18n-logo.svg',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/intlify/vue-i18n-next' },
      { icon: 'twitter', link: 'https://twitter.com/intlify' },
    ],

    editLink: {
      pattern: 'https://github.com/intlify/vue-i18n-next/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2015-present kazuya kawaguchi'
    },

    carbonAds: {
      code: 'CEAIC53M',
      placement: 'kazupongithubio',
    },

    // TODO: we need to upgrade?
    // @ts-ignore
    algolia: {
      appId: 'BH4D9OD16A',
      apiKey: '3a9e93ba1069de0ece2ae100daf8f6ea',
      indexName: 'vue-i18n',
      // algoliaOptions: { facetFilters: ['tags:guide,api'] }
    },
    
    nav: nav(),

    sidebar: {
      '/guide/': sidebarGuide(),
      '/api/': sidebarApi(),
      '/ecosystem/': sidebarEcosystem()
    }
  }
})

function nav() {
  return [
    {
      text: 'Guide',
      link: '/guide/'
    },
    {
      text: 'API',
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
  ]  
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsible: true,
      items: [
        {
          text: 'What is Vue I18n?',
          link: '/guide/introduction'
        },
        {
          text: 'Getting Started',
          link: '/guide/',
        },
        {
          text: 'Installation',
          link: '/guide/installation'
        }
      ]
    },
    {
      text: 'Essentials',
      collapsible: true,
      items: [
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
      collapsible: true,
      items: [
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
      collapsible: true,
      items: [
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
      text: 'v8.x',
      collapsible: true,
      collapsed: true,
      items: [
        { 
          text: 'Documentation for v8.x',
          link: '/guide/v8-docs'
        }
      ]
    }
  ]
}

function sidebarApi() {
  return [
    {
      text: 'API Refenrence',
      items: [
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
  ]
}
function sidebarEcosystem() {
  return [
    {
      text: 'Ecosystem',
      items: [
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
        }
      ]
    }
  ]
}
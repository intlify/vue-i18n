import { defineConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';
import typedocSidebarApi from '../api/typedoc-sidebar.json' with { type: 'json' };
import jp from './locales/jp.js';
import zh from './locales/zh.js';

import type { HeadConfig } from 'vitepress';

const head: HeadConfig[] = [['link', { rel: 'icon', href: '/vue-i18n-logo.png' }]]

export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'Vue I18n',
      description: 'Internationalization plugin for Vue.js'
    },
    zh,
    jp
  },
  lastUpdated: true,
  head,

  markdown: { attrs: { disable: true } },

  vite: {
    plugins: [llmstxt()]
  },

  themeConfig: {
    logo: '/vue-i18n-logo.svg',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/intlify/vue-i18n' },
      { icon: 'twitter', link: 'https://twitter.com/intlify' }
    ],

    editLink: {
      pattern:
        'https://github.com/intlify/vue-i18n/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2015-present kazuya kawaguchi'
    },

    carbonAds: {
      code: 'CWYDVK37',
      placement: 'vue-i18nintlifydev'
    },

    search: {
      provider: 'local',
    },

    nav: nav(),

    sidebar: {
      '/guide/v11/': sidebarGuideV11(),
      '/guide/': sidebarGuide(),
      '/ecosystem/': sidebarEcosystem(),
      '/api/v11/': sidebarApiV11("v11/"),
      '/api/': sidebarApi()
    }
  }
})

function nav() {
  return [
    {
      text: 'Guide',
      link: '/guide/installation',
    },
    {
      text: 'API',
      link: '/api/v11/general/',
    },
    {
      text: 'Ecosystem',
      link: '/ecosystem/official',
    },
    {
      text: 'Version',
      items: [
        { text: 'Maintenance Status', link: '/guide/maintenance' },
        { text: 'v11 Guide', link: '/guide/v11/essentials/started' },
        { text: 'v8.x', link: 'https://kazupon.github.io/vue-i18n/' }
      ]
    },
    {
      text: 'Changelog',
      link: 'https://github.com/intlify/vue-i18n/blob/master/CHANGELOG.md'
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
          text: 'Installation',
          link: '/guide/installation'
        },
        {
          text: 'Maintenance Status',
          link: '/guide/maintenance'
        },
      ]
    },
    {
      text: 'Essentials',
      collapsible: true,
      items: [
        {
          text: 'Getting Started',
          link: '/guide/essentials/started',
        },
        {
          text: 'Message Format Syntax',
          link: '/guide/essentials/syntax'
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
          link: '/guide/advanced/composition'
        },
        {
          text: 'TypeScript Support',
          link: '/guide/advanced/typescript'
        },
        {
          text: 'Web components',
          link: '/guide/advanced/wc'
        },
        {
          text: 'Optimization',
          link: '/guide/advanced/optimization'
        },
        {
          text: 'Custom Message Format',
          link: '/guide/advanced/format'
        },
        {
          text: 'Petite Vue I18n',
          link: '/guide/advanced/lite'
        }
      ]
    },
    {
      text: 'Frameworks Integration',
      collapsible: false,
      items: [
        {
          text: 'Nuxt',
          link: '/guide/integrations/nuxt'
        }
      ]
    },
    {
      text: 'Migrations',
      collapsible: true,
      items: [
        {
          text: 'Breaking Changes in v12',
          link: '/guide/migration/breaking12'
        },
        {
          text: 'Breaking Changes in v11',
          link: '/guide/migration/breaking11'
        },
        {
          text: 'Breaking Changes in v10',
          link: '/guide/migration/breaking10'
        },
        {
          text: 'Breaking Changes in v9',
          link: '/guide/migration/breaking'
        },
        {
          text: 'New Features in v9',
          link: '/guide/migration/features'
        },
        {
          text: 'Migration in Vue 3',
          link: '/guide/migration/vue3'
        }
      ]
    },
    {
      text: 'Extra Topics',
      collapsible: true,
      items: [
        {
          text: 'Different Distribution files',
          link: '/guide/extra/dist'
        },
        {
          text: 'Migration from Vue 2',
          link: '/guide/migration/vue2'
        }
      ]
    }
  ]
}

function sidebarGuideV11() {
  return [
    {
      text: 'Guide v11',
      items: [
        {
          text: 'Back to Latest Guide',
          link: '/guide/installation'
        }
      ]
    },
    {
      text: 'Essentials',
      collapsible: true,
      items: [
        { text: 'Getting Started', link: '/guide/v11/essentials/started' },
        { text: 'Message Format Syntax', link: '/guide/v11/essentials/syntax' },
        { text: 'Pluralization', link: '/guide/v11/essentials/pluralization' },
        { text: 'Datetime Formatting', link: '/guide/v11/essentials/datetime' },
        { text: 'Number Formatting', link: '/guide/v11/essentials/number' },
        { text: 'Scope and Locale Changing', link: '/guide/v11/essentials/scope' },
        { text: 'Fallbacking', link: '/guide/v11/essentials/fallback' },
        { text: 'Local Scope Based Localization', link: '/guide/v11/essentials/local' }
      ]
    },
    {
      text: 'Advanced',
      collapsible: true,
      items: [
        { text: 'Component Interpolation', link: '/guide/v11/advanced/component' },
        { text: 'Single File Components', link: '/guide/v11/advanced/sfc' },
        { text: 'Lazy Loading', link: '/guide/v11/advanced/lazy' },
        { text: 'Message Functions', link: '/guide/v11/advanced/function' },
        { text: 'Composition API', link: '/guide/v11/advanced/composition' },
        { text: 'TypeScript Support', link: '/guide/v11/advanced/typescript' },
        { text: 'Web components', link: '/guide/v11/advanced/wc' },
        { text: 'Optimization', link: '/guide/v11/advanced/optimization' },
        { text: 'Custom Message Format', link: '/guide/v11/advanced/format' },
        { text: 'Petite Vue I18n', link: '/guide/v11/advanced/lite' }
      ]
    }
  ]
}

function sidebarApiV11(ns = '') {
  return [
    {
      text: 'API Reference v11',
      items: [
        {
          text: 'General',
          link: `/api/${ns}general`
        },
        {
          text: 'Legacy API',
          link: `/api/${ns}legacy`
        },
        {
          text: 'Composition API',
          link: `/api/${ns}composition`
        },
        {
          text: 'Components',
          link: `/api/${ns}component`
        },
        {
          text: 'Directives',
          link: `/api/${ns}directive`
        },
        {
          text: 'Component Injections',
          link: `/api/${ns}injection`
        }
      ]
    }
  ]
}

function sidebarApi() {
  return [{
    text: 'API Reference',
    collapsed: false,
    items: typedocSidebarApi
  }]
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

import typedocSidebarApi from '../../zh/api/typedoc-sidebar.json' with { type: 'json' };

export default {
  label: '中文',
  lang: 'zh',
  dir: 'src/zh',
  title: 'Vue I18n',
  description: 'Vue.js 的国际化插件',
  themeConfig: {
    nav: nav(),
    sidebar:  {
      '/zh/guide/v11/': sidebarGuideV11(),
      '/zh/guide/': sidebarGuide(),
      '/zh/ecosystem/': sidebarEcosystem(),
      '/zh/api/v11/': sidebarApiV11(),
      '/zh/api/': sidebarApi()
    }
  }
};

function nav() {
  return [
    {
      text: '指南',
      link: '/zh/guide/installation'
    },
    {
      text: 'API',
      link: '/zh/api/v11/general'
    },
    {
      text: '生态系统',
      link: '/zh/ecosystem/official'
    },
    {
      text: '版本',
      items: [
        { text: '维护状态', link: '/zh/guide/maintenance' },
        { text: 'v11 指南', link: '/zh/guide/v11/essentials/started' },
        { text: 'v8.x', link: 'https://kazupon.github.io/vue-i18n/' }
      ]
    },
    {
      text: '更新日志',
      link: 'https://github.com/intlify/vue-i18n/blob/master/CHANGELOG.md'
    }
  ];
}

function sidebarGuide() {
  return [
    {
      text: '介绍',
      collapsible: true,
      items: [
        {
          text: '什么是 Vue I18n？',
          link: '/zh/guide/introduction'
        },
        {
          text: '安装',
          link: '/zh/guide/installation'
        },
        {
          text: '维护状态',
          link: '/zh/guide/maintenance'
        }
      ]
    },
    {
      text: '基础',
      collapsible: true,
      items: [
        {
          text: '快速开始',
          link: '/zh/guide/essentials/started'
        },
        {
          text: '消息格式语法',
          link: '/zh/guide/essentials/syntax'
        },
        {
          text: '复数形式',
          link: '/zh/guide/essentials/pluralization'
        },
        {
          text: '日期时间格式化',
          link: '/zh/guide/essentials/datetime'
        },
        {
          text: '数字格式化',
          link: '/zh/guide/essentials/number'
        },
        {
          text: '作用域和区域设置更改',
          link: '/zh/guide/essentials/scope'
        },
        {
          text: '回退机制',
          link: '/zh/guide/essentials/fallback'
        },
        {
          text: '基于本地作用域的本地化',
          link: '/zh/guide/essentials/local'
        }
      ]
    },
    {
      text: '高级',
      collapsible: true,
      items: [
        {
          text: '组件插值',
          link: '/zh/guide/advanced/component'
        },
        {
          text: '单文件组件',
          link: '/zh/guide/advanced/sfc'
        },
        {
          text: '懒加载',
          link: '/zh/guide/advanced/lazy'
        },
        {
          text: '消息函数',
          link: '/zh/guide/advanced/function'
        },
        {
          text: '组合式 API',
          link: '/zh/guide/advanced/composition'
        },
        {
          text: 'TypeScript 支持',
          link: '/zh/guide/advanced/typescript'
        },
        {
          text: 'Web 组件',
          link: '/zh/guide/advanced/wc'
        },
        {
          text: '优化',
          link: '/zh/guide/advanced/optimization'
        },
        {
          text: '自定义消息格式',
          link: '/zh/guide/advanced/format'
        },
        {
          text: 'Petite Vue I18n',
          link: '/zh/guide/advanced/lite'
        },
        {
          text: '自定义指令',
          link: '/zh/guide/advanced/directive'
        }
      ]
    },
    {
      text: '框架集成',
      collapsible: false,
      items: [
        {
          text: 'Nuxt',
          link: '/zh/guide/integrations/nuxt'
        }
      ]
    },
    {
      text: '迁移',
      collapsible: true,
      items: [
        {
          text: 'v12 中的破坏性变更',
          link: '/zh/guide/migration/breaking12'
        },
        {
          text: 'v11 中的破坏性变更',
          link: '/zh/guide/migration/breaking11'
        },
        {
          text: 'v10 中的破坏性变更',
          link: '/zh/guide/migration/breaking10'
        },
        {
          text: 'v9 中的破坏性变更',
          link: '/zh/guide/migration/breaking'
        },
        {
          text: 'v9 中的新特性',
          link: '/zh/guide/migration/features'
        },
        {
          text: 'Vue 3 迁移',
          link: '/zh/guide/migration/vue3'
        }
      ]
    },
    {
      text: '其他主题',
      collapsible: true,
      items: [
        {
          text: '不同的分发文件',
          link: '/zh/guide/extra/dist'
        },
        {
          text: '从 Vue 2 迁移',
          link: '/zh/guide/migration/vue2'
        }
      ]
    }
  ];
}

function sidebarApi() {
  return [{
    text: 'API 参考',
    collapsed: false,
    items: typedocSidebarApi
  }];
}

function sidebarEcosystem() {
  return [
    {
      text: '生态系统',
      collapsible: false,
      items: [
        {
          text: '官方工具',
          link: '/zh/ecosystem/official'
        },
        {
          text: '第三方集成',
          link: '/zh/ecosystem/integrations'
        },
        {
          text: '第三方工具',
          link: '/zh/ecosystem/tools'
        }
      ]
    }
  ];
}

function sidebarGuideV11() {
  return [
    {
      text: '指南 v11',
      items: [
        {
          text: '返回最新指南',
          link: '/zh/guide/installation'
        }
      ]
    },
    {
      text: '基础',
      collapsible: true,
      items: [
        { text: '快速开始', link: '/zh/guide/v11/essentials/started' },
        { text: '消息格式语法', link: '/zh/guide/v11/essentials/syntax' },
        { text: '复数形式', link: '/zh/guide/v11/essentials/pluralization' },
        { text: '日期时间格式化', link: '/zh/guide/v11/essentials/datetime' },
        { text: '数字格式化', link: '/zh/guide/v11/essentials/number' },
        { text: '作用域和区域设置更改', link: '/zh/guide/v11/essentials/scope' },
        { text: '回退机制', link: '/zh/guide/v11/essentials/fallback' },
        { text: '基于本地作用域的本地化', link: '/zh/guide/v11/essentials/local' }
      ]
    },
    {
      text: '高级',
      collapsible: true,
      items: [
        { text: '组件插值', link: '/zh/guide/v11/advanced/component' },
        { text: '单文件组件', link: '/zh/guide/v11/advanced/sfc' },
        { text: '懒加载', link: '/zh/guide/v11/advanced/lazy' },
        { text: '消息函数', link: '/zh/guide/v11/advanced/function' },
        { text: '组合式 API', link: '/zh/guide/v11/advanced/composition' },
        { text: 'TypeScript 支持', link: '/zh/guide/v11/advanced/typescript' },
        { text: 'Web 组件', link: '/zh/guide/v11/advanced/wc' },
        { text: '优化', link: '/zh/guide/v11/advanced/optimization' },
        { text: '自定义消息格式', link: '/zh/guide/v11/advanced/format' },
        { text: 'Petite Vue I18n', link: '/zh/guide/v11/advanced/lite' },
        { text: '自定义指令', link: '/zh/guide/v11/advanced/directive' }
      ]
    }
  ];
}

function sidebarApiV11() {
  return [
    {
      text: 'API 参考 v11',
      items: [
        {
          text: '通用',
          link: '/zh/api/v11/general'
        },
        {
          text: '传统 API',
          link: '/zh/api/v11/legacy'
        },
        {
          text: '组合式 API',
          link: '/zh/api/v11/composition'
        },
        {
          text: '组件',
          link: '/zh/api/v11/component'
        },
        {
          text: '指令',
          link: '/zh/api/v11/directive'
        },
        {
          text: '组件注入',
          link: '/zh/api/v11/injection'
        }
      ]
    }
  ];
}

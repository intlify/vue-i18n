import typedocSidebarApi from '../../jp/api/typedoc-sidebar.json' with { type: 'json' };

export default {
  label: '日本語',
  lang: 'jp',
  title: 'Vue I18n',
  dir: 'src/jp',
  description: 'Vue.js の国際化プラグイン',
  themeConfig: {
    nav: nav(),
    sidebar: {
      '/jp/guide/v11/': sidebarGuideV11(),
      '/jp/guide/': sidebarGuide(),
      '/jp/ecosystem/': sidebarEcosystem(),
      '/jp/api/v11/': sidebarApiV11(),
      '/jp/api/': sidebarApi()
    }
  }
};

function nav() {
  return [
    {
      text: 'ガイド',
      link: '/jp/guide/installation'
    },
    {
      text: 'API',
      link: '/jp/api/v11/general'
    },
    {
      text: 'エコシステム',
      link: '/jp/ecosystem/official'
    },
    {
      text: 'バージョン',
      items: [
        { text: 'メンテナンスステータス', link: '/jp/guide/maintenance' },
        { text: 'v11 ガイド', link: '/jp/guide/v11/essentials/started' },
        { text: 'v8.x', link: 'https://kazupon.github.io/vue-i18n/' }
      ]
    },
    {
      text: '変更ログ',
      link: 'https://github.com/intlify/vue-i18n/blob/master/CHANGELOG.md'
    }
  ];
}

function sidebarGuide() {
  return [
    {
      text: '紹介',
      collapsible: true,
      items: [
        {
          text: 'Vue I18n とは？',
          link: '/jp/guide/introduction'
        },
        {
          text: 'インストール',
          link: '/jp/guide/installation'
        },
        {
          text: 'メンテナンスステータス',
          link: '/jp/guide/maintenance'
        }
      ]
    },
    {
      text: '基本',
      collapsible: true,
      items: [
        {
          text: 'クイックスタート',
          link: '/jp/guide/essentials/started'
        },
        {
          text: 'メッセージフォーマット構文',
          link: '/jp/guide/essentials/syntax'
        },
        {
          text: '複数化',
          link: '/jp/guide/essentials/pluralization'
        },
        {
          text: '日付時刻のフォーマット',
          link: '/jp/guide/essentials/datetime'
        },
        {
          text: '数値のフォーマット',
          link: '/jp/guide/essentials/number'
        },
        {
          text: 'スコープとロケールの変更',
          link: '/jp/guide/essentials/scope'
        },
        {
          text: 'フォールバック',
          link: '/jp/guide/essentials/fallback'
        },
        {
          text: 'ローカルスコープベースのローカリゼーション',
          link: '/jp/guide/essentials/local'
        }
      ]
    },
    {
      text: '高度な機能',
      collapsible: true,
      items: [
        {
          text: 'コンポーネント補間',
          link: '/jp/guide/advanced/component'
        },
        {
          text: 'シングルファイルコンポーネント',
          link: '/jp/guide/advanced/sfc'
        },
        {
          text: '遅延ロード',
          link: '/jp/guide/advanced/lazy'
        },
        {
          text: 'メッセージ関数',
          link: '/jp/guide/advanced/function'
        },
        {
          text: 'Composition API',
          link: '/jp/guide/advanced/composition'
        },
        {
          text: 'TypeScript サポート',
          link: '/jp/guide/advanced/typescript'
        },
        {
          text: 'Web コンポーネント',
          link: '/jp/guide/advanced/wc'
        },
        {
          text: '最適化',
          link: '/jp/guide/advanced/optimization'
        },
        {
          text: 'カスタムメッセージフォーマット',
          link: '/jp/guide/advanced/format'
        },
        {
          text: 'Petite Vue I18n',
          link: '/jp/guide/advanced/lite'
        },
        {
          text: 'カスタムディレクティブ',
          link: '/jp/guide/advanced/directive'
        }
      ]
    },
    {
      text: 'フレームワーク統合',
      collapsible: false,
      items: [
        {
          text: 'Nuxt',
          link: '/jp/guide/integrations/nuxt'
        }
      ]
    },
    {
      text: 'マイグレーション',
      collapsible: true,
      items: [
        {
          text: 'v12 の破壊的変更',
          link: '/jp/guide/migration/breaking12'
        },
        {
          text: 'v11 の破壊的変更',
          link: '/jp/guide/migration/breaking11'
        },
        {
          text: 'v10 の破壊的変更',
          link: '/jp/guide/migration/breaking10'
        },
        {
          text: 'v9 の破壊的変更',
          link: '/jp/guide/migration/breaking'
        },
        {
          text: 'v9 の新機能',
          link: '/jp/guide/migration/features'
        },
        {
          text: 'Vue 3 へのマイグレーション',
          link: '/jp/guide/migration/vue3'
        }
      ]
    },
    {
      text: 'その他のトピック',
      collapsible: true,
      items: [
        {
          text: '異なるディストリビューションファイル',
          link: '/jp/guide/extra/dist'
        },
        {
          text: 'Vue 2 からのマイグレーション',
          link: '/jp/guide/migration/vue2'
        }
      ]
    }
  ];
}

function sidebarApi() {
  return [{
    text: 'API リファレンス',
    collapsed: false,
    items: typedocSidebarApi
  }];
}

function sidebarEcosystem() {
  return [
    {
      text: 'エコシステム',
      collapsible: false,
      items: [
        {
          text: '公式ツール',
          link: '/jp/ecosystem/official'
        },
        {
          text: 'サードパーティ統合',
          link: '/jp/ecosystem/integrations'
        },
        {
          text: 'サードパーティツール',
          link: '/jp/ecosystem/tools'
        }
      ]
    }
  ];
}

function sidebarGuideV11() {
  return [
    {
      text: 'ガイド v11',
      items: [
        {
          text: '最新ガイドに戻る',
          link: '/jp/guide/installation'
        }
      ]
    },
    {
      text: '基本',
      collapsible: true,
      items: [
        { text: 'クイックスタート', link: '/jp/guide/v11/essentials/started' },
        { text: 'メッセージフォーマット構文', link: '/jp/guide/v11/essentials/syntax' },
        { text: '複数化', link: '/jp/guide/v11/essentials/pluralization' },
        { text: '日付時刻のフォーマット', link: '/jp/guide/v11/essentials/datetime' },
        { text: '数値のフォーマット', link: '/jp/guide/v11/essentials/number' },
        { text: 'スコープとロケールの変更', link: '/jp/guide/v11/essentials/scope' },
        { text: 'フォールバック', link: '/jp/guide/v11/essentials/fallback' },
        { text: 'ローカルスコープベースのローカリゼーション', link: '/jp/guide/v11/essentials/local' }
      ]
    },
    {
      text: '高度な機能',
      collapsible: true,
      items: [
        { text: 'コンポーネント補間', link: '/jp/guide/v11/advanced/component' },
        { text: 'シングルファイルコンポーネント', link: '/jp/guide/v11/advanced/sfc' },
        { text: '遅延ロード', link: '/jp/guide/v11/advanced/lazy' },
        { text: 'メッセージ関数', link: '/jp/guide/v11/advanced/function' },
        { text: 'Composition API', link: '/jp/guide/v11/advanced/composition' },
        { text: 'TypeScript サポート', link: '/jp/guide/v11/advanced/typescript' },
        { text: 'Web コンポーネント', link: '/jp/guide/v11/advanced/wc' },
        { text: '最適化', link: '/jp/guide/v11/advanced/optimization' },
        { text: 'カスタムメッセージフォーマット', link: '/jp/guide/v11/advanced/format' },
        { text: 'Petite Vue I18n', link: '/jp/guide/v11/advanced/lite' },
        { text: 'カスタムディレクティブ', link: '/jp/guide/v11/advanced/directive' }
      ]
    }
  ];
}

function sidebarApiV11() {
  return [
    {
      text: 'API リファレンス v11',
      items: [
        {
          text: '一般',
          link: '/jp/api/v11/general'
        },
        {
          text: 'レガシー API',
          link: '/jp/api/v11/legacy'
        },
        {
          text: 'Composition API',
          link: '/jp/api/v11/composition'
        },
        {
          text: 'コンポーネント',
          link: '/jp/api/v11/component'
        },
        {
          text: 'ディレクティブ',
          link: '/jp/api/v11/directive'
        },
        {
          text: 'コンポーネントインジェクション',
          link: '/jp/api/v11/injection'
        }
      ]
    }
  ];
}

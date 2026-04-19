import { createI18n as _createI18n } from 'vue-i18n'
import en from './locales/en.json' with { type: 'json' }
import ja from './locales/ja.json' with { type: 'json' }

// const messageImports = import.meta.glob('./locales/*.json')
// console.log(messageImports)

export const SUPPORT_LOCALES = ['en', 'ja']

export function createI18n() {
  return _createI18n({
    globalInjection: true,
    locale: 'ja',
    fallbackLocale: 'en',
    messages: {
      en,
      ja
    }
  })
}

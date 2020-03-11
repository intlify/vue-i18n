import { App } from 'vue'
import { Locale, createRuntime, Runtime } from './runtime'
import { applyPlugin } from './plugin'

export type I18nOptions = {
  locale?: Locale
}
export type VueI18n = Runtime & {
  install: (app: App) => void
}

export function createI18n (options: I18nOptions = {}): VueI18n {
  const i18n = createRuntime(options) as VueI18n
  i18n.install = (app: App): void => {
    applyPlugin(app, i18n)
  }
  return i18n
}

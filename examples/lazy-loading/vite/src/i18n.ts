import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

import type { I18n, I18nOptions, Locale, VueI18n, Composer } from 'vue-i18n'

export const SUPPORT_LOCALES = ['en', 'ja']

export function getLocale(i18n: I18n): string {
  return i18n.mode === 'legacy'
    ? (i18n.global as unknown as VueI18n).locale
    : (i18n.global as unknown as Composer).locale.value
}

export function setLocale(i18n: I18n, locale: Locale): void {
  if (i18n.mode === 'legacy') {
    ;(i18n.global as unknown as VueI18n).locale = locale
  } else {
    ;(i18n.global as unknown as Composer).locale.value = locale
  }
}

export function setupI18n(options: I18nOptions = { locale: 'en' }): I18n {
  const i18n = createI18n(options)
  setI18nLanguage(i18n, options.locale!)
  return i18n
}

export function setI18nLanguage(i18n: I18n, locale: Locale): void {
  setLocale(i18n, locale)
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')!.setAttribute('lang', locale)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResourceMessages = (r: any) => r.default || r

export async function loadLocaleMessages(i18n: I18n, locale: Locale) {
  // load locale messages
  const messages = await import(
    /* @vite-ignore */ `./locales/${locale}.json`
  ).then(getResourceMessages)

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages)

  return nextTick()
}

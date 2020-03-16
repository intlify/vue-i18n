import { InjectionKey, inject, getCurrentInstance, ComponentInternalInstance, reactive } from 'vue'
import { Path } from './path'
import { LinkedModifiers } from './context'
import { Locale, LocaleMessages, createRuntime } from './runtime'

export const GlobalI18nSymbol: InjectionKey<I18nComposer> = Symbol.for('vue-i18n')
const providers: Map<ComponentInternalInstance, InjectionKey<I18nComposer>> = new Map()

export type I18nComposerOptions = {
  // TODO:
  locale?: Locale
  fallbackLocales?: Locale[]
  messages?: LocaleMessages
  modifiers?: LinkedModifiers
  fallbackRoot?: boolean
}

export type I18nComposer = {
  // TODO:
  // properties
  locale: Locale
  fallbackLocales: Locale[]
  readonly messages: LocaleMessages
  // methods
  t (key: Path, ...args: unknown[]): string
}

// TODO:
export function createI18nComposer (options: I18nComposerOptions = {}): I18nComposer {
  const runtime = createRuntime(options)
  let _locale: Locale = options.locale || 'en-US'
  let _fallbackLocales: Locale[] = options.fallbackLocales || [_locale]
  let _messages = reactive(options.messages || { [_locale]: {} })

  const t = (key: Path, ...args: unknown[]): string => {
    return key
  }

  return {
    /* properties */
    // locale
    get locale (): Locale { return _locale },
    set locale (val: Locale) { _locale = val },
    // fallbackLocales
    get fallbackLocales (): Locale[] { return _fallbackLocales },
    set fallbackLocales (val: Locale[]) { _fallbackLocales = val },
    // messages
    get messages (): LocaleMessages { return _messages },
    set messages (val: LocaleMessages) { _messages = reactive(val) },
    /* methods */
    t
  }
}

function getProvider (instance: ComponentInternalInstance): InjectionKey<I18nComposer> {
  let current = instance
  let symbol = providers.get(current)
  while (!symbol) {
    if (!current.parent) {
      symbol = GlobalI18nSymbol
      break
    } else {
      current = current.parent
      symbol = providers.get(current)
      if (symbol) {
        break
      }
    }
  }
  return symbol
}

// exports vue-i18n composable API
export function useI18n (options: I18nComposerOptions = {}): I18nComposer {
  const instance = getCurrentInstance()
  const symbol = !instance ? GlobalI18nSymbol : getProvider(instance)
  return inject(symbol) || createI18nComposer(options)
}

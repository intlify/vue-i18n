import { InjectionKey, inject, getCurrentInstance, ComponentInternalInstance } from 'vue'

export const GlobalI18nSymbol: InjectionKey<I18nComposer> = Symbol.for('vue-i18n')
const providers: Map<ComponentInternalInstance, InjectionKey<I18nComposer>> = new Map()

export type I18nComposerOptions = {
  // TODO:
}

export type I18nComposer = {
  // TODO:
}

export function createI18nComposer (options: I18nComposerOptions = {}): I18nComposer {
  // TODO:
  return {}
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

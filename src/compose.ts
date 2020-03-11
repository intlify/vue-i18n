import { InjectionKey, inject, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { Runtime, RuntimeOptions, createRuntime } from './runtime'

export const VueI18nSymbol: InjectionKey<Runtime> = Symbol.for('vue-i18n')
const providers: Map<ComponentInternalInstance, InjectionKey<Runtime>> = new Map()

function getProvider (instance: ComponentInternalInstance): InjectionKey<Runtime> {
  let current = instance
  let symbol = providers.get(current)
  while (!symbol) {
    if (!current.parent) {
      symbol = VueI18nSymbol
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

// for composition API
export function useI18n (options: RuntimeOptions = {}): Runtime {
  const instance = getCurrentInstance()
  const symbol = !instance ? VueI18nSymbol : getProvider(instance)
  return inject(symbol) || createRuntime(options)
}

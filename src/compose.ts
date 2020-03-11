import { InjectionKey, inject, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { Runtime, RuntimeOptions, createRuntime } from './runtime'

export const VueI18nSymbol: InjectionKey<Runtime> = Symbol.for('vue-i18n')
const providers: Map<ComponentInternalInstance, InjectionKey<Runtime>> = new Map()

function getProvider (ctx: ComponentInternalInstance): InjectionKey<Runtime> {
  let current = ctx
  let s = providers.get(current)
  while (!s) {
    if (!current.parent) {
      s = VueI18nSymbol
      break
    } else {
      current = current.parent
      s = providers.get(current)
      if (s) {
        break
      }
    }
  }
  return s
}

// for composition API
export function useI18n (options: RuntimeOptions = {}): Runtime {
  const ctx = getCurrentInstance()
  const ps = !ctx ? VueI18nSymbol : getProvider(ctx)
  const runtime = inject(ps, createRuntime(options))
  return runtime
}

import {
  provide,
  inject,
  InjectionKey,
  getCurrentInstance,
  ComponentInternalInstance,
  ComponentOptions
} from 'vue'
import {
  I18nComposer,
  I18nComposerOptions,
  createI18nComposer
} from './composer'

export const GlobalI18nSymbol: InjectionKey<I18nComposer> = Symbol.for(
  'vue-i18n'
)
const providers: Map<
  ComponentInternalInstance,
  InjectionKey<I18nComposer>
> = new Map()

const generateSymbolID = (): string =>
  `vue-i18n-${new Date().getUTCMilliseconds().toString()}`

// enable composable API via I18n Composer
export function useI18n(options?: I18nComposerOptions): I18nComposer {
  const globalComposer = inject(GlobalI18nSymbol)
  if (!globalComposer) throw new Error('TODO') // TODO:

  const instance = getCurrentInstance()
  if (instance === null || !options) {
    return globalComposer
  }

  const symbol = providers.get(instance)
  if (!symbol) {
    const type = instance.type as ComponentOptions
    if (type.__i18n) {
      options.__i18n = type.__i18n
    }
    const composer = createI18nComposer(options, globalComposer)
    const sym: InjectionKey<I18nComposer> = Symbol.for(generateSymbolID())
    providers.set(instance, sym)
    provide(sym, composer)
    return composer
  } else {
    const composer = inject(symbol) || globalComposer
    if (!composer) throw new Error('TODO') // TODO:
    return composer
  }
}

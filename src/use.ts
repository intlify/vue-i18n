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

/**
 * Enable vue-i18n composable API
 *
 * @example
 * case: Component resource base localization
 * ```html
 * <template>
 *   <form>
 *     <label>{{ t('language') }}</label>
 *     <select v-model="locale">
 *       <option value="en">en</option>
 *       <option value="ja">ja</option>
 *     </select>
 *   </form>
 *   <p>message: {{ t('hello') }}</p>
 * </template>
 *
 * <script>
 * import { useI18n } from 'vue-i18n'
 *
 * export default {
 *  setup() {
 *    const { t, locale } = useI18n({
 *      locale: 'ja',
 *      messages: {
 *        en: { ... },
 *        ja: { ... }
 *      }
 *    })
 *    // Something to do ...
 *
 *    return { ..., t, locale }
 *  }
 * }
 * </script>
 * ```
 */
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
    if (globalComposer) {
      options._root = globalComposer
    }
    const composer = createI18nComposer(options)
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

import {
  provide,
  inject,
  InjectionKey,
  getCurrentInstance,
  ComponentInternalInstance,
  ComponentOptions
} from 'vue'
import { Composer, ComposerOptions, createComposer } from './composer'
import { createVueI18n, VueI18n, VueI18nOptions } from './legacy'
import { isBoolean, generateSymbolID } from './utils'

export const GlobalI18nSymbol: InjectionKey<Composer> = Symbol.for('vue-i18n')
const providers: Map<
  ComponentInternalInstance,
  InjectionKey<Composer>
> = new Map()

export function enumProviders(): void {
  if (__DEV__) {
    providers.forEach((sym, instance) => {
      console.log('provider:', instance, sym)
    })
  }
}

/**
 *  I18n Options
 *
 *  This option is `createI18n` factory option
 */
export type I18nOptions = {
  legacy?: boolean
} & (ComposerOptions | VueI18nOptions)

/**
 * I18n factory
 *
 * @example
 * case: for Composable API
 * ```js
 * import { createApp } from 'vue'
 * import { createI18n, useI18n } from 'vue-i18n'
 *
 * // call with I18n option
 * const i18n = createI18n({
 *   locale: 'ja',
 *   messages: {
 *     en: { ... },
 *     ja: { ... }
 *   }
 * })
 *
 * const App = {
 *   setup() {
 *     // ...
 *     const { t } = useI18n({ ... })
 *     return { ... , t }
 *   }
 * }
 *
 * const app = createApp(App)
 *
 * // install!
 * app.use(i18n)
 * app.mount('#app')
 * ```
 *
 * @example
 * case: for Legacy API
 * ```js
 * import { createApp } from 'vue'
 * import { createI18n } from 'vue-i18n'
 *
 * // call with I18n option
 * const i18n = createI18n({
 *   legacy: true, // you must specify 'lagacy' option
 *   locale: 'ja',
 *   messages: {
 *     en: { ... },
 *     ja: { ... }
 *   }
 * })
 *
 * const App = {
 *   // ...
 * }
 *
 * const app = createApp(App)
 *
 * // install!
 * app.use(i18n)
 * app.mount('#app')
 * ```
 */
export function createI18n(options: I18nOptions = {}): Composer | VueI18n {
  const legacyMode = isBoolean(options.legacy) ? options.legacy : false
  return legacyMode ? createVueI18n(options) : createComposer(options)
}

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
export function useI18n(options?: ComposerOptions): Composer {
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
      options.__root = globalComposer
    }
    const composer = createComposer(options)
    const sym: InjectionKey<Composer> = Symbol.for(generateSymbolID())
    providers.set(instance, sym)
    provide(sym, composer)
    return composer
  } else {
    const composer = inject(symbol) || globalComposer
    if (!composer) throw new Error('TODO') // TODO:
    return composer
  }
}

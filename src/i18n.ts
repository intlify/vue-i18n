import {
  provide,
  inject,
  onMounted,
  onUnmounted,
  InjectionKey,
  getCurrentInstance,
  ComponentInternalInstance,
  ComponentOptions
} from 'vue'
import { Composer, ComposerOptions, createComposer } from './composer'
import { createVueI18n, VueI18n, VueI18nOptions } from './legacy'
import { isEmptyObject } from './utils'

const generateSymbolID = (): string =>
  `vue-i18n-${new Date().getUTCMilliseconds().toString()}`

export const GlobalI18nSymbol: InjectionKey<Composer> = Symbol.for('vue-i18n')
let globalInstance: VueI18n | Composer | null = null

const providers: Map<
  ComponentInternalInstance,
  InjectionKey<Composer>
> = new Map()

const getGlobalComposer = (): Composer => {
  if (globalInstance === null) throw new Error('TODO') // TODO:
  return '__composer' in globalInstance
    ? globalInstance.__composer
    : globalInstance
}

// TODO: if we don't need the below, should be removed!
//       This code should be removed with using rollup (`/*#__PURE__*/`)
export function enumProviders(): void {
  if (__DEV__) {
    providers.forEach((sym, instance) => {
      console.log('provider:', instance, sym)
    })
  }
}

export function getComposer(
  instance: ComponentInternalInstance | null
): Composer {
  if (!instance) {
    return getGlobalComposer()
  }
  const symbol = providers.get(instance)
  return symbol ? inject(symbol, getGlobalComposer()) : getGlobalComposer()
}

/*!
 * I18n Options
 *
 * {@link createI18n} factory option.
 *
 * @remarks
 * `I18nOptions` is union type of {@link ComposerOptions} and {@link VueI18nOptions}, so you can specify these options.
 *
 */
export type I18nOptions = {
  /**
   * @defaultValue `false`
   */
  legacy?: boolean
} & (ComposerOptions | VueI18nOptions)

/*!
 * I18n factory
 *
 * @param options - see the {@link I18nOptions}
 * @returns {@link Composer} object, or {@link VueI18n} object
 *
 * @remarks
 * When you use Composable API, you need to specify options of {@link ComposerOptions}.
 * When you use Legacy API, you need toto specify options of {@link VueI18nOptions} and `legacy: true`.
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
 *   legacy: true, // you must specify 'lagacy: true' option
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
  if (globalInstance !== null) {
    return globalInstance
  }

  const legacyMode = !!options.legacy
  return (globalInstance = legacyMode
    ? createVueI18n(options)
    : createComposer(options))
}

/*!
 * Use Composable API
 *
 * @param options - See the {@link ComponentOptions}
 * @returns {@link Composer} object
 *
 * @remarks
 * This function is mainly used by `setup`.
 * If options are specified Composer object is created for each component, and you can be localized on the component.
 * If options are not specified, you can be localized using the global Composer.
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
export function useI18n(options: ComposerOptions = {}): Composer {
  const globalComposer = getGlobalComposer()

  const instance = getCurrentInstance()
  if (instance === null || isEmptyObject(options)) {
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
    setupLifeCycle(instance, composer)

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

function setupLifeCycle(
  instance: ComponentInternalInstance | null,
  composer: Composer
): void {
  onMounted(() => {
    // inject composer instance to DOM for intlify-devtools
    if (instance) {
      if (instance.proxy) {
        instance.proxy.$el.__intlify__ = composer
      }
    }
  })

  onUnmounted(() => {
    // remove composer instance from DOM for intlify-devtools
    const instance = getCurrentInstance()
    if (instance) {
      if (instance.proxy && instance.proxy.$el.__intlify__) {
        instance.proxy.$el.__intlify__ = undefined
        delete instance.proxy.$el.__intlify__
      }
    }
  })
}

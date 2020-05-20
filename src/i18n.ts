import {
  inject,
  onMounted,
  onUnmounted,
  InjectionKey,
  getCurrentInstance,
  ComponentInternalInstance,
  ComponentOptions,
  App
} from 'vue'
import {
  Composer,
  ComposerInternal,
  ComposerOptions,
  ComposerInternalOptions,
  createComposer
} from './composer'
import {
  createVueI18n,
  VueI18n,
  VueI18nOptions,
  VueI18nInternal
} from './legacy'
import { I18nErrorCodes, createI18nError } from './errors'
import { apply } from './plugin'
import { defineMixin } from './mixin'
import { isEmptyObject } from './utils'

/**
 * I18n Options for `createI18n`
 *
 * @remarks
 * `I18nOptions` is inherited {@link I18nAdditionalOptions}, {@link ComposerOptions} and {@link VueI18nOptions},
 * so you can specify these options.
 *
 */
export type I18nOptions = I18nAdditionalOptions &
  (ComposerOptions | VueI18nOptions)

/**
 * I18n Additional Options for `createI18n`
 */
export interface I18nAdditionalOptions {
  /**
   * Whether vue-i18n legacy API use on your Vue App.
   *
   * @defaultValue `false`
   */
  legacy?: boolean
}

/**
 * I18n API mode
 */
export type I18nMode = 'legacy' | 'composable'

/**
 * I18n interface
 */
export interface I18n {
  /**
   * I18n API mode
   *
   * @remarks
   * if you specified `legacy: true` option in `createI18n`, return `legacy`,
   * else `composable`
   *
   * @defaultValue `composable`
   */
  readonly mode: I18nMode
  /**
   * Global composer
   */
  readonly global: Composer
  /**
   * @internal
   */
  install(app: App, ...options: unknown[]): void
}

/**
 * I18n interface for internal usage
 *
 * @internal
 */
export interface I18nInternal {
  _getComposer(instance: ComponentInternalInstance): Composer | null
  _setComposer(instance: ComponentInternalInstance, composer: Composer): void
  _deleteComposer(instance: ComponentInternalInstance): void
  _getLegacy(instance: ComponentInternalInstance): VueI18n | null
  _setLegacy(instance: ComponentInternalInstance, legacy: VueI18n): void
  _deleteLegacy(instance: ComponentInternalInstance): void
}

/**
 * I18n Scope
 */
export type I18nScope = 'local' | 'parent' | 'global'

/**
 * I18n Options for `useI18n`
 *
 * @remarks
 * `UseI18nOptions` is inherited {@link ComposerAdditionalOptions} and {@link ComposerOptions},
 * so you can specify these options.
 */
export type UseI18nOptions = ComposerAdditionalOptions & ComposerOptions

/**
 * Composer additional options for `useI18n`
 *
 * @remarks
 * `ComposerAdditionalOptions` is extend for {@link ComposerOptions}, so you can specify these options.
 */
export interface ComposerAdditionalOptions {
  useScope?: I18nScope
}

/**
 * I18n instance injectin key
 * @internal
 */
export const I18nSymbol: InjectionKey<I18n & I18nInternal> = Symbol.for(
  'vue-i18n'
)

/**
 * I18n factory function
 *
 * @param options - see the {@link I18nOptions}
 * @returns {@link I18n} object
 *
 * @remarks
 * When you use Composable API, you need to specify options of {@link ComposerOptions}.
 * When you use Legacy API, you need toto specify options of {@link VueI18nOptions} and `legacy: true` option.
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
export function createI18n(options: I18nOptions = {}): I18n {
  const __legacyMode = !!options.legacy
  const __composers = new Map<ComponentInternalInstance, Composer>()
  const __legaceis = new Map<ComponentInternalInstance, VueI18n>()
  const __global = __legacyMode
    ? createVueI18n(options)
    : createComposer(options)

  const i18n = {
    // mode
    get mode(): I18nMode {
      return __legacyMode ? 'legacy' : 'composable'
    },
    install(app: App, ...options: unknown[]): void {
      apply(app, i18n, ...options)
      if (__legacyMode) {
        app.mixin(
          defineMixin(
            __global as VueI18n & VueI18nInternal,
            (__global as VueI18n & VueI18nInternal).__composer,
            i18n
          )
        )
      }
    },
    get global(): Composer {
      return __legacyMode
        ? (__global as VueI18n & VueI18nInternal).__composer
        : (__global as Composer)
    },
    _getComposer(instance: ComponentInternalInstance): Composer | null {
      return __composers.get(instance) || null
    },
    _setComposer(
      instance: ComponentInternalInstance,
      composer: Composer
    ): void {
      __composers.set(instance, composer)
    },
    _deleteComposer(instance: ComponentInternalInstance): void {
      __composers.delete(instance)
    },
    _getLegacy(instance: ComponentInternalInstance): VueI18n | null {
      return __legaceis.get(instance) || null
    },
    _setLegacy(instance: ComponentInternalInstance, legacy: VueI18n): void {
      __legaceis.set(instance, legacy)
    },
    _deleteLegacy(instance: ComponentInternalInstance): void {
      __legaceis.delete(instance)
    }
  }

  return i18n
}

/**
 * Use Composable API starting function
 *
 * @param options - See {@link UseI18nOptions}
 * @returns {@link Composer} object
 *
 * @remarks
 * This function is mainly used by `setup`.
 * If options are specified, Composer object is created for each component and you can be localized on the component.
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
export function useI18n(options: UseI18nOptions = {}): Composer {
  const i18n = inject(I18nSymbol)
  if (!i18n) {
    throw createI18nError(I18nErrorCodes.NOT_INSLALLED)
  }

  const global = i18n.global

  let emptyOption = false
  // prettier-ignore
  const scope: I18nScope = (emptyOption = isEmptyObject(options)) // eslint-disable-line no-cond-assign
    ? 'global'
    : !options.useScope
      ? 'local'
      : options.useScope

  if (emptyOption) {
    return global
  }

  const instance = getCurrentInstance()
  /* istanbul ignore if */
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
  }

  if (scope === 'parent') {
    let composer = getComposer(i18n, instance)
    if (composer == null) {
      // TODO: warning!
      composer = global
    }
    return composer
  } else if (scope === 'global') {
    return global
  }

  // scope 'local' case
  if (i18n.mode === 'legacy') {
    throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE)
  }

  let composer = i18n._getComposer(instance)
  if (composer == null) {
    const type = instance.type as ComponentOptions
    const composerOptions: ComposerOptions & ComposerInternalOptions = {
      ...options
    }
    if (type.__i18n) {
      composerOptions.__i18n = type.__i18n
    }

    if (global) {
      composerOptions.__root = global
    }

    composer = createComposer(composerOptions)
    setupLifeCycle(i18n, instance, composer)

    i18n._setComposer(instance, composer)
  }

  return composer as Composer & ComposerInternal
}

function getComposer(
  i18n: I18n & I18nInternal,
  target: ComponentInternalInstance
): Composer | null {
  let composer: Composer | null = null
  const root = target.root
  let current: ComponentInternalInstance | null = target.parent
  while (current != null) {
    if (i18n.mode === 'composable') {
      composer = i18n._getComposer(current)
    } else {
      const vueI18n = i18n._getLegacy(current)
      if (vueI18n != null) {
        composer = (vueI18n as VueI18n & VueI18nInternal).__composer
      }
    }
    if (composer != null) {
      break
    }
    if (root === current) {
      break
    }
    current = current.parent
  }
  return composer
}

function setupLifeCycle(
  i18n: I18nInternal,
  target: ComponentInternalInstance,
  composer: Composer
): void {
  onMounted(() => {
    // inject composer instance to DOM for intlify-devtools
    if (target.proxy) {
      target.proxy.$el.__intlify__ = composer
    }
  }, target)

  onUnmounted(() => {
    // remove composer instance from DOM for intlify-devtools
    if (target.proxy && target.proxy.$el.__intlify__) {
      delete target.proxy.$el.__intlify__
    }
    i18n._deleteComposer(target)
  }, target)
}

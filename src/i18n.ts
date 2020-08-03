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
import { LocaleMessageDictionary } from './core/context'
import {
  VueMessageType,
  Composer,
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
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { I18nErrorCodes, createI18nError } from './errors'
import { apply } from './plugin'
import { defineMixin } from './mixin'
import { isEmptyObject, warn } from './utils'

/**
 * I18n Options for `createI18n`
 *
 * @remarks
 * `I18nOptions` is inherited {@link I18nAdditionalOptions}, {@link ComposerOptions} and {@link VueI18nOptions},
 * so you can specify these options.
 *
 */
export type I18nOptions<Messages> = I18nAdditionalOptions &
  (ComposerOptions<Messages> | VueI18nOptions<Messages>)

/**
 * I18n Additional Options for `createI18n`
 */
export interface I18nAdditionalOptions {
  /**
   * Whether vue-i18n legacy API use on your Vue App.
   *
   * @default false
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
export interface I18n<Messages = {}> {
  /**
   * I18n API mode
   *
   * @remarks
   * if you specified `legacy: true` option in `createI18n`, return `legacy`,
   * else `composable`
   *
   * @default composable
   */
  readonly mode: I18nMode
  /**
   * Global composer
   */
  readonly global: Composer<Messages>
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
  __getInstance<
    Messages,
    Instance extends VueI18n<Messages> | Composer<Messages>
  >(
    component: ComponentInternalInstance
  ): Instance | null
  __setInstance<
    Messages,
    Instance extends VueI18n<Messages> | Composer<Messages>
  >(
    component: ComponentInternalInstance,
    instance: Instance
  ): void
  __deleteInstance(component: ComponentInternalInstance): void
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
export type UseI18nOptions<Messages> = ComposerAdditionalOptions &
  ComposerOptions<Messages>

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
export const I18nSymbol: InjectionKey<I18n> = Symbol.for('vue-i18n')

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
export function createI18n<
  Options extends I18nOptions<Messages> = {},
  Messages extends Record<
    keyof Options['messages'],
    LocaleMessageDictionary<VueMessageType>
  > = Record<keyof Options['messages'], LocaleMessageDictionary<VueMessageType>>
>(options: Options = {} as Options): I18n<Options['messages']> {
  const __legacyMode = !!options.legacy
  const __instances = new Map<
    ComponentInternalInstance,
    VueI18n<Messages> | Composer<Messages>
  >()
  const __global = __legacyMode
    ? createVueI18n(options)
    : createComposer(options)

  const i18n = {
    // mode
    get mode(): I18nMode {
      return __legacyMode ? 'legacy' : 'composable'
    },
    install(app: App, ...options: unknown[]): void {
      apply<Messages>(app, i18n, ...options)
      if (__legacyMode) {
        app.mixin(
          defineMixin(
            __global as VueI18n<Messages>,
            ((__global as unknown) as VueI18nInternal<Messages>)
              .__composer as Composer<Messages>,
            i18n as I18nInternal
          )
        )
      }
    },
    get global(): Composer<Messages> {
      return __legacyMode
        ? (((__global as unknown) as VueI18nInternal<Messages>)
            .__composer as Composer<Messages>)
        : (__global as Composer<Messages>)
    },
    __getInstance<
      M extends Messages,
      Instance extends VueI18n<M> | Composer<M>
    >(component: ComponentInternalInstance): Instance | null {
      return ((__instances.get(component) as unknown) as Instance) || null
    },
    __setInstance<
      M extends Messages,
      Instance extends VueI18n<M> | Composer<M>
    >(component: ComponentInternalInstance, instance: Instance): void {
      __instances.set(component, instance)
    },
    __deleteInstance(component: ComponentInternalInstance): void {
      __instances.delete(component)
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
export function useI18n<
  Options extends UseI18nOptions<Messages> = object,
  Messages extends Record<
    keyof Options['messages'],
    LocaleMessageDictionary<VueMessageType>
  > = Record<keyof Options['messages'], LocaleMessageDictionary<VueMessageType>>
>(options: Options = {} as Options): Composer<Options['messages']> {
  const i18n = inject(I18nSymbol) as I18n<Messages>
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
      if (__DEV__) {
        warn(getWarnMessage(I18nWarnCodes.NOT_FOUND_PARENT_COMPOSER))
      }
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

  const i18nInternal = (i18n as unknown) as I18nInternal
  let composer = i18nInternal.__getInstance<Messages, Composer<Messages>>(
    instance
  )
  if (composer == null) {
    const type = instance.type as ComponentOptions
    const composerOptions: ComposerOptions<Messages> &
      ComposerInternalOptions<Messages> = {
      ...options
    }
    if (type.__i18n) {
      composerOptions.__i18n = type.__i18n
    }

    if (global) {
      composerOptions.__root = global
    }

    composer = createComposer(composerOptions) as Composer<Messages>
    setupLifeCycle<Messages>(i18nInternal, instance, composer)

    i18nInternal.__setInstance<Messages, Composer<Messages>>(instance, composer)
  }

  return composer as Composer<Messages>
}

function getComposer<Messages>(
  i18n: I18n<Messages>,
  target: ComponentInternalInstance
): Composer<Messages, VueMessageType> | null {
  let composer: Composer<Messages, VueMessageType> | null = null
  const root = target.root
  let current: ComponentInternalInstance | null = target.parent
  while (current != null) {
    const i18nInternal = (i18n as unknown) as I18nInternal
    if (i18n.mode === 'composable') {
      composer = i18nInternal.__getInstance<Messages, Composer<Messages>>(
        current
      )
    } else {
      const vueI18n = i18nInternal.__getInstance<Messages, VueI18n<Messages>>(
        current
      )
      if (vueI18n != null) {
        composer = (vueI18n as VueI18n<Messages> & VueI18nInternal<Messages>)
          .__composer as Composer<Messages>
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

function setupLifeCycle<Messages>(
  i18n: I18nInternal,
  target: ComponentInternalInstance,
  composer: Composer<Messages>
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
    i18n.__deleteInstance(target)
  }, target)
}

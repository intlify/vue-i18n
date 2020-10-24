import {
  inject,
  onMounted,
  onUnmounted,
  InjectionKey,
  getCurrentInstance,
  ComponentInternalInstance,
  ComponentOptions,
  App,
  isRef
} from 'vue'
import { Locale, FallbackLocale, LocaleMessageDictionary } from './core/context'
import { DateTimeFormat, NumberFormat } from './core/types'
import {
  VueMessageType,
  Composer,
  ComposerOptions,
  ComposerInternalOptions,
  createComposer,
  EnableEmitter,
  DisableEmitter
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
import { isEmptyObject, isBoolean, warn, makeSymbol } from './utils'
import {
  devtoolsRegisterI18n,
  enableDevTools,
  addTimelineEvent
} from './debugger/devtools'
import { DevToolsEmitter, DevToolsEmitterEvents } from './debugger/constants'
import { createEmitter } from './debugger/emitter'
import { VERSION } from './misc'

declare module '@vue/runtime-core' {
  // eslint-disable-next-line
  interface App<HostElement = any> {
    __VUE_I18N__?: I18n & I18nInternal
    __VUE_I18N_SYMBOL__?: InjectionKey<I18n> | string
  }
}

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
   * Whether vue-i18n legacy API use on your Vue App
   *
   * @default true
   */
  legacy?: boolean
  /**
   * Whether Whether to inject global props & methods into for each component
   *
   * @default true
   */
  globalInjection?: boolean
}

/**
 * Vue I18n API mode
 */
export type I18nMode = 'legacy' | 'composition'

/**
 * I18n interface
 */
export interface I18n<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  Legacy extends boolean = true
> {
  /**
   * Vue I18n API mode
   *
   * @remarks
   * if you specified `legacy: true` option in `createI18n`, return `legacy`,
   * else `composition`
   *
   * @default composition
   */
  readonly mode: I18nMode
  /**
   * Global composer
   */
  readonly global: Legacy extends true
    ? VueI18n<Messages, DateTimeFormats, NumberFormats>
    : Composer<Messages, DateTimeFormats, NumberFormats>
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
  __instances: Map<ComponentInternalInstance, VueI18n | Composer>
  __getInstance<
    Messages,
    DateTimeFormats,
    NumberFormats,
    Instance extends
      | VueI18n<Messages, DateTimeFormats, NumberFormats>
      | Composer<Messages, DateTimeFormats, NumberFormats>
  >(
    component: ComponentInternalInstance
  ): Instance | null
  __setInstance<
    Messages,
    DateTimeFormats,
    NumberFormats,
    Instance extends
      | VueI18n<Messages, DateTimeFormats, NumberFormats>
      | Composer<Messages, DateTimeFormats, NumberFormats>
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
 * I18n factory function
 *
 * @param options - see the {@link I18nOptions}
 * @returns {@link I18n} object
 *
 * @remarks
 * When you use Legacy API, you need toto specify options of {@link VueI18nOptions} and `legacy: true` option.
 * When you use composition API, you need to specify options of {@link ComposerOptions}.
 *
 * @example
 * case: for Legacy API
 * ```js
 * import { createApp } from 'vue'
 * import { createI18n } from 'vue-i18n'
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
 *   // ...
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
 * case: for composition API
 * ```js
 * import { createApp } from 'vue'
 * import { createI18n, useI18n } from 'vue-i18n'
 *
 * // call with I18n option
 * const i18n = createI18n({
 *   legacy: false, // you must specify 'lagacy: false' option
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
 */
export function createI18n<
  Options extends I18nOptions = {},
  Messages extends Record<
    keyof Options['messages'],
    LocaleMessageDictionary<VueMessageType>
  > = Record<
    keyof Options['messages'],
    LocaleMessageDictionary<VueMessageType>
  >,
  DateTimeFormats extends Record<
    keyof Options['datetimeFormats'],
    DateTimeFormat
  > = Record<keyof Options['datetimeFormats'], DateTimeFormat>,
  NumberFormats extends Record<
    keyof Options['numberFormats'],
    NumberFormat
  > = Record<keyof Options['numberFormats'], NumberFormat>
>(
  options: Options = {} as Options
): I18n<
  Options['messages'],
  Options['datetimeFormats'],
  Options['numberFormats'],
  Options['legacy'] extends boolean ? Options['legacy'] : true
> {
  type _I18n = I18n & I18nInternal

  // prettier-ignore
  const __legacyMode = __FEATURE_LEGACY_API__ && isBoolean(options.legacy)
    ? options.legacy
    : true
  const __globalInjection = !options.globalInjection
  const __instances = new Map<
    ComponentInternalInstance,
    VueI18n<Messages> | Composer<Messages>
  >()
  // prettier-ignore
  const __global = __FEATURE_LEGACY_API__ && __legacyMode
    ? createVueI18n(options)
    : createComposer(options)
  const symbol: InjectionKey<I18n> | string = makeSymbol(
    __DEV__ ? 'vue-i18n' : ''
  )

  type Legacy = Options['legacy'] extends boolean ? Options['legacy'] : true
  // prettier-ignore
  type GlobalType = Legacy extends true
    ? VueI18n<Messages, DateTimeFormats, NumberFormats>
    : Legacy extends false
      ? Composer<Messages, DateTimeFormats, NumberFormats>
      : VueI18n<Messages, DateTimeFormats, NumberFormats>

  const i18n = {
    // mode
    get mode(): I18nMode {
      // prettier-ignore
      return __FEATURE_LEGACY_API__
        ? __legacyMode
          ? 'legacy'
          : 'composition'
        : 'composition'
    },
    // install plugin
    async install(app: App, ...options: unknown[]): Promise<void> {
      if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && !__NODE_JS__) {
        app.__VUE_I18N__ = i18n as _I18n
      }

      // setup global provider
      app.__VUE_I18N_SYMBOL__ = symbol
      app.provide(app.__VUE_I18N_SYMBOL__, i18n as I18n)

      // global method and properties injection for Composition API
      if (!__legacyMode && __globalInjection) {
        injectGlobalFields<Messages, DateTimeFormats, NumberFormats>(
          app,
          i18n.global as Composer<Messages, DateTimeFormats, NumberFormats>
        )
      }

      // install built-in components and directive
      if (__FEATURE_FULL_INSTALL__) {
        apply<Messages, DateTimeFormats, NumberFormats, Legacy>(
          app,
          i18n as I18n<Messages, DateTimeFormats, NumberFormats, Legacy>,
          ...options
        )
      }

      // setup mixin for Legacy API
      if (__FEATURE_LEGACY_API__ && __legacyMode) {
        app.mixin(
          defineMixin<Messages, DateTimeFormats, NumberFormats>(
            __global as VueI18n<Messages, DateTimeFormats, NumberFormats>,
            ((__global as unknown) as VueI18nInternal<
              Messages,
              DateTimeFormats,
              NumberFormats
            >).__composer as Composer<Messages, DateTimeFormats, NumberFormats>,
            i18n as I18nInternal
          )
        )
      }

      // setup vue-devtools plugin
      if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && !__NODE_JS__) {
        const ret = await enableDevTools(app, i18n as _I18n)
        if (!ret) {
          throw createI18nError(I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN)
        }
        const emitter: DevToolsEmitter = createEmitter<DevToolsEmitterEvents>()
        if (__legacyMode) {
          const _vueI18n = (__global as unknown) as VueI18nInternal<
            Messages,
            DateTimeFormats,
            NumberFormats
          >
          _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const _composer = __global as any
          _composer[EnableEmitter] && _composer[EnableEmitter](emitter)
        }
        emitter.on('*', addTimelineEvent)
      }
    },
    // global accsessor
    get global(): GlobalType {
      return __global as GlobalType
    },
    // @internal
    __instances,
    // @internal
    __getInstance<
      M extends Messages,
      Instance extends VueI18n<M> | Composer<M>
    >(component: ComponentInternalInstance): Instance | null {
      return ((__instances.get(component) as unknown) as Instance) || null
    },
    // @internal
    __setInstance<
      M extends Messages,
      Instance extends VueI18n<M> | Composer<M>
    >(component: ComponentInternalInstance, instance: Instance): void {
      __instances.set(component, instance)
    },
    // @internal
    __deleteInstance(component: ComponentInternalInstance): void {
      __instances.delete(component)
    }
  }

  if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && !__NODE_JS__) {
    devtoolsRegisterI18n(
      i18n as I18n<Messages, DateTimeFormats, NumberFormats, Legacy>,
      VERSION
    )
  }

  return i18n as I18n<Messages, DateTimeFormats, NumberFormats, Legacy>
}

/**
 * Use Composition API starting function
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
  Options extends UseI18nOptions = object,
  Messages extends Record<
    keyof Options['messages'],
    LocaleMessageDictionary<VueMessageType>
  > = Record<
    keyof Options['messages'],
    LocaleMessageDictionary<VueMessageType>
  >,
  DateTimeFormats extends Record<
    keyof Options['datetimeFormats'],
    DateTimeFormat
  > = Record<keyof Options['datetimeFormats'], DateTimeFormat>,
  NumberFormats extends Record<
    keyof Options['numberFormats'],
    NumberFormat
  > = Record<keyof Options['numberFormats'], NumberFormat>
>(
  options: Options = {} as Options
): Composer<
  Options['messages'],
  Options['datetimeFormats'],
  Options['numberFormats']
> {
  const instance = getCurrentInstance()
  /* istanbul ignore if */
  if (instance == null || !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
  }

  const i18n = inject(instance.appContext.app.__VUE_I18N_SYMBOL__)
  if (!i18n) {
    throw createI18nError(I18nErrorCodes.NOT_INSLALLED)
  }

  const global =
    i18n.mode === 'composition'
      ? ((i18n.global as unknown) as Composer<
          Messages,
          DateTimeFormats,
          NumberFormats
        >)
      : ((i18n.global as unknown) as VueI18nInternal<
          Messages,
          DateTimeFormats,
          NumberFormats
        >).__composer

  // prettier-ignore
  const scope: I18nScope = isEmptyObject(options)
    ? 'global'
    : !options.useScope
      ? 'local'
      : options.useScope

  if (scope === 'global') {
    return global
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
  }

  // scope 'local' case
  if (i18n.mode === 'legacy') {
    throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE)
  }

  const i18nInternal = (i18n as unknown) as I18nInternal
  let composer = i18nInternal.__getInstance<
    Messages,
    DateTimeFormats,
    NumberFormats,
    Composer<Messages, DateTimeFormats, NumberFormats>
  >(instance)
  if (composer == null) {
    const type = instance.type as ComponentOptions
    const composerOptions: ComposerOptions &
      ComposerInternalOptions<Messages, DateTimeFormats, NumberFormats> = {
      ...options
    }
    if (type.__i18n) {
      composerOptions.__i18n = type.__i18n
    }

    if (global) {
      composerOptions.__root = global
    }

    composer = createComposer(composerOptions) as Composer<
      Messages,
      DateTimeFormats,
      NumberFormats
    >
    setupLifeCycle<Messages, DateTimeFormats, NumberFormats>(
      i18nInternal,
      instance,
      composer
    )

    i18nInternal.__setInstance<
      Messages,
      DateTimeFormats,
      NumberFormats,
      Composer<Messages, DateTimeFormats, NumberFormats>
    >(instance, composer)
  }

  return composer as Composer<Messages>
}

function getComposer<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  i18n: I18n<Messages, DateTimeFormats, NumberFormats, Legacy>,
  target: ComponentInternalInstance
): Composer<Messages, DateTimeFormats, NumberFormats> | null {
  let composer: Composer<Messages, DateTimeFormats, NumberFormats> | null = null
  const root = target.root
  let current: ComponentInternalInstance | null = target.parent
  while (current != null) {
    const i18nInternal = (i18n as unknown) as I18nInternal
    if (i18n.mode === 'composition') {
      composer = i18nInternal.__getInstance<
        Messages,
        DateTimeFormats,
        NumberFormats,
        Composer<Messages, DateTimeFormats, NumberFormats>
      >(current)
    } else {
      const vueI18n = i18nInternal.__getInstance<
        Messages,
        DateTimeFormats,
        NumberFormats,
        VueI18n<Messages, DateTimeFormats, NumberFormats>
      >(current)
      if (vueI18n != null) {
        composer = (vueI18n as VueI18n<
          Messages,
          DateTimeFormats,
          NumberFormats
        > &
          VueI18nInternal<Messages, DateTimeFormats, NumberFormats>)
          .__composer as Composer<Messages, DateTimeFormats, NumberFormats>
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

function setupLifeCycle<Messages, DateTimeFormats, NumberFormats>(
  i18n: I18nInternal,
  target: ComponentInternalInstance,
  composer: Composer<Messages, DateTimeFormats, NumberFormats>
): void {
  let emitter: DevToolsEmitter | null = null

  onMounted(() => {
    // inject composer instance to DOM for intlify-devtools
    if (
      (__DEV__ || __FEATURE_PROD_DEVTOOLS__) &&
      !__NODE_JS__ &&
      target.vnode.el
    ) {
      target.vnode.el.__INTLIFY__ = composer
      emitter = createEmitter<DevToolsEmitterEvents>()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _composer = composer as any
      _composer[EnableEmitter] && _composer[EnableEmitter](emitter)
      emitter.on('*', addTimelineEvent)
    }
  }, target)

  onUnmounted(() => {
    // remove composer instance from DOM for intlify-devtools
    if (
      (__DEV__ || __FEATURE_PROD_DEVTOOLS__) &&
      !__NODE_JS__ &&
      target.vnode.el &&
      target.vnode.el.__INTLIFY__
    ) {
      emitter && emitter.off('*', addTimelineEvent)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _composer = composer as any
      _composer[DisableEmitter] && _composer[DisableEmitter]()
      delete target.vnode.el.__INTLIFY__
    }
    i18n.__deleteInstance(target)
  }, target)
}

/**
 * Exported composer interface
 *
 * @remarks
 * This interface is the {@link I18n.global | global composer } that is provided interface that is injected into each component with `app.config.globalProperties`.
 */
export interface ExportedComposer {
  /**
   * Locale
   *
   * @remarks
   * This property is proxy-like property for `composer#locale`. About details, see the {@link Composer | Composer#locale } property
   */
  locale: Locale
  /**
   * Fallback locale
   *
   * @remarks
   * This property is proxy-like property for `composer#fallbackLocale`. About details, see the {@link Composer | Composer#fallbackLocale } property
   */
  fallbackLocale: FallbackLocale
  /**
   * Available locales
   *
   * @remarks
   * This property is proxy-like property for `composer#availableLocales`. About details, see the {@link Composer | Composer#availableLocales } property
   */
  readonly availableLocales: Locale[]
}

const globalExportProps = [
  'locale',
  'fallbackLocale',
  'availableLocales'
] as const
const globalExportMethods = ['t', 'd', 'n', 'tm'] as const

function injectGlobalFields<Messages, DateTimeFormats, NumberFormats>(
  app: App,
  composer: Composer<Messages, DateTimeFormats, NumberFormats>
): void {
  const i18n = Object.create(null)
  globalExportProps.forEach(prop => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop)
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
    }
    const wrap = isRef(desc.value) // check computed props
      ? {
          get() {
            return desc.value.value
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          set(val: any) {
            desc.value.value = val
          }
        }
      : {
          get() {
            return desc.get && desc.get()
          }
        }
    Object.defineProperty(i18n, prop, wrap)
  })
  app.config.globalProperties.$i18n = i18n

  globalExportMethods.forEach(method => {
    const desc = Object.getOwnPropertyDescriptor(composer, method)
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc)
  })
}

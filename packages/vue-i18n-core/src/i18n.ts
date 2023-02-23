import {
  inject,
  onBeforeMount,
  onMounted,
  onUnmounted,
  InjectionKey,
  getCurrentInstance,
  shallowRef,
  isRef,
  ref,
  computed,
  effectScope
} from 'vue'
import {
  inBrowser,
  isEmptyObject,
  isBoolean,
  isString,
  isArray,
  isPlainObject,
  isRegExp,
  isFunction,
  warn,
  makeSymbol,
  createEmitter,
  assign
} from '@intlify/shared'
import { createComposer, DEFAULT_LOCALE } from './composer'
import { createVueI18n } from './legacy'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { I18nErrorCodes, createI18nError } from './errors'
import {
  EnableEmitter,
  DisableEmitter,
  InejctWithOption,
  LegacyInstanceSymbol,
  __VUE_I18N_BRIDGE__
} from './symbols'
import { apply as applyNext } from './plugin/next'
import { apply as applyBridge } from './plugin/bridge'
import { defineMixin as defineMixinNext } from './mixins/next'
import { defineMixin as defineMixinBridge } from './mixins/bridge'
import { enableDevTools, addTimelineEvent } from './devtools'
import {
  isLegacyVueI18n,
  getComponentOptions,
  getLocaleMessages,
  adjustI18nResources
} from './utils'

import type { ComponentInternalInstance, App, EffectScope } from 'vue'
import type {
  Locale,
  Path,
  FallbackLocale,
  SchemaParams,
  LocaleMessages,
  LocaleMessage,
  LocaleMessageValue,
  LocaleMessageDictionary,
  PostTranslationHandler,
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType,
  DateTimeFormat,
  NumberFormat,
  LocaleParams,
  LinkedModifiers,
  PluralizationRules
} from '@intlify/core-base'
import type {
  VueDevToolsEmitter,
  VueDevToolsEmitterEvents
} from '@intlify/vue-devtools'
import type {
  VueMessageType,
  MissingHandler,
  DefaultLocaleMessageSchema,
  DefaultDateTimeFormatSchema,
  DefaultNumberFormatSchema,
  Composer,
  ComposerOptions,
  ComposerInternalOptions
} from './composer'
import type { VueI18n, VueI18nOptions, VueI18nInternal } from './legacy'

declare module 'vue' {
  // eslint-disable-next-line
  interface App<HostElement = any> {
    __VUE_I18N__?: I18n & I18nInternal
    __VUE_I18N_SYMBOL__?: InjectionKey<I18n> | string
  }
}

// internal Component Instance API isCE
declare module '@vue/runtime-core' {
  export interface ComponentInternalInstance {
    /**
     * @internal
     * is custom element?
     */
    isCE?: boolean
  }
}

// for bridge
let _legacyVueI18n: any = /* #__PURE__*/ null // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * I18n Options for `createI18n`
 *
 * @remarks
 * `I18nOptions` is inherited {@link I18nAdditionalOptions}, {@link ComposerOptions} and {@link VueI18nOptions},
 * so you can specify these options.
 *
 * @VueI18nGeneral
 */
export type I18nOptions<
  Schema extends {
    message?: unknown
    datetime?: unknown
    number?: unknown
  } = {
    message: DefaultLocaleMessageSchema
    datetime: DefaultDateTimeFormatSchema
    number: DefaultNumberFormatSchema
  },
  Locales extends
    | {
        messages: unknown
        datetimeFormats: unknown
        numberFormats: unknown
      }
    | string = Locale,
  Options extends
    | ComposerOptions<Schema, Locales>
    | VueI18nOptions<Schema, Locales> =
    | ComposerOptions<Schema, Locales>
    | VueI18nOptions<Schema, Locales>
> = I18nAdditionalOptions & Options

/**
 * I18n Additional Options
 *
 * @remarks
 * Specific options for {@link createI18n}
 *
 * @VueI18nGeneral
 */
export interface I18nAdditionalOptions {
  /**
   * Whether vue-i18n Legacy API mode use on your Vue App
   *
   * @remarks
   * The default is to use the Legacy API mode. If you want to use the Composition API mode, you need to set it to `false`.
   *
   * @VueI18nSee [Composition API](../guide/advanced/composition)
   *
   * @defaultValue `true`
   */
  legacy?: boolean
  /**
   * Whether to inject global properties & functions into for each component.
   *
   * @remarks
   * If set to `true`, then properties and methods prefixed with `$` are injected into Vue Component.
   *
   * @VueI18nSee [Implicit with injected properties and functions](../guide/advanced/composition#implicit-with-injected-properties-and-functions)
   * @VueI18nSee [ComponentCustomProperties](injection#componentcustomproperties)
   *
   * @defaultValue `true`
   */
  globalInjection?: boolean
  /**
   * Whether to allow the Composition API to be used in Legacy API mode.
   *
   * @remarks
   * If this option is enabled, you can use {@link useI18n} in Legacy API mode. This option is supported to support the migration from Legacy API mode to Composition API mode.
   *
   * @VueI18nWarning Note that the Composition API made available with this option doesn't work on SSR.
   * @VueI18nSee [Composition API](../guide/advanced/composition)
   *
   * @defaultValue `false`
   */
  allowComposition?: boolean
}

/**
 * Vue I18n API mode
 *
 * @VueI18nSee [I18n#mode](general#mode)
 *
 * @VueI18nGeneral
 */
export type I18nMode = 'legacy' | 'composition'

/**
 * I18n instance
 *
 * @remarks
 * The instance required for installation as the Vue plugin
 *
 * @VueI18nGeneral
 */
export interface I18n<
  Messages extends Record<string, unknown> = {},
  DateTimeFormats extends Record<string, unknown> = {},
  NumberFormats extends Record<string, unknown> = {},
  OptionLocale = Locale,
  Legacy = boolean
> {
  /**
   * Vue I18n API mode
   *
   * @remarks
   * If you specified `legacy: true` option in `createI18n`, return `legacy`, else `composition`
   *
   * @defaultValue `'legacy'`
   */
  readonly mode: I18nMode
  // prettier-ignore
  /**
   * The property accessible to the global Composer instance or VueI18n instance
   *
   * @remarks
   * If the [I18n#mode](general#mode) is `'legacy'`, then you can access to a global {@link VueI18n} instance, else then [I18n#mode](general#mode) is `'composition' `, you can access to the global {@link Composer} instance.
   *
   * An instance of this property is **global scope***.
   */
  readonly global: Legacy extends true
    ? VueI18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>
    : Legacy extends false
      ? Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
      : unknown
  /**
   * The property whether or not the Composition API is available
   *
   * @remarks
   * If you specified `allowComposition: true` option in Legacy API mode, return `true`, else `false`. else you use the Composition API mode, this property will always return `true`.
   */
  readonly allowComposition: boolean
  /**
   * Install entry point
   *
   * @param app - A target Vue app instance
   * @param options - An install options
   */
  install(app: App, ...options: unknown[]): void
  /**
   * Release global scope resource
   */
  dispose(): void
}

/**
 * @internal
 */
type ExtendHooks = {
  __composerExtend?: (composer: Composer) => void
  __vueI18nExtend?: (vueI18n: VueI18n) => void
}

/**
 * I18n interface for internal usage
 *
 * @internal
 */
export interface I18nInternal<
  Messages extends Record<string, unknown> = {},
  DateTimeFormats extends Record<string, unknown> = {},
  NumberFormats extends Record<string, unknown> = {},
  OptionLocale = Locale
> {
  __instances: Map<
    ComponentInternalInstance,
    | VueI18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>
    | Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  >
  __getInstance<
    Instance extends
      | VueI18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>
      | Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  >(
    component: ComponentInternalInstance
  ): Instance | null
  __setInstance<
    Instance extends
      | VueI18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>
      | Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  >(
    component: ComponentInternalInstance,
    instance: Instance
  ): void
  __deleteInstance(component: ComponentInternalInstance): void
  __composerExtend?: Required<ExtendHooks>['__composerExtend']
  __vueI18nExtend?: Required<ExtendHooks>['__vueI18nExtend']
}

/**
 * I18n Scope
 *
 * @VueI18nSee [ComposerAdditionalOptions#useScope](composition#usescope)
 * @VueI18nSee [useI18n](composition#usei18n)
 *
 * @VueI18nGeneral
 */
export type I18nScope = 'local' | 'parent' | 'global'

/**
 * I18n Options for `useI18n`
 *
 * @remarks
 * `UseI18nOptions` is inherited {@link ComposerAdditionalOptions} and {@link ComposerOptions}, so you can specify these options.
 *
 * @VueI18nSee [useI18n](composition#usei18n)
 *
 * @VueI18nComposition
 */
export type UseI18nOptions<
  Schema extends {
    message?: unknown
    datetime?: unknown
    number?: unknown
  } = {
    message: DefaultLocaleMessageSchema
    datetime: DefaultDateTimeFormatSchema
    number: DefaultNumberFormatSchema
  },
  Locales extends
    | {
        messages: unknown
        datetimeFormats: unknown
        numberFormats: unknown
      }
    | string = Locale,
  Options extends ComposerOptions<Schema, Locales> = ComposerOptions<
    Schema,
    Locales
  >
> = ComposerAdditionalOptions & Options

/**
 * Composer additional options for `useI18n`
 *
 * @remarks
 * `ComposerAdditionalOptions` is extend for {@link ComposerOptions}, so you can specify these options.
 *
 * @VueI18nSee [useI18n](composition#usei18n)
 *
 * @VueI18nComposition
 */
export interface ComposerAdditionalOptions {
  useScope?: I18nScope
}

/**
 * Injection key for {@link useI18n}
 *
 * @remarks
 * The global injection key for I18n instances with `useI18n`. this injection key is used in Web Components.
 * Specify the i18n instance created by {@link createI18n} together with `provide` function.
 *
 * @VueI18nGeneral
 */
export const I18nInjectionKey: InjectionKey<I18n> | string =
  /* #__PURE__*/ makeSymbol('global-vue-i18n')

export function createI18n<
  Legacy extends boolean = true,
  Options extends I18nOptions = I18nOptions,
  Messages extends Record<string, unknown> = Options['messages'] extends Record<
    string,
    unknown
  >
    ? Options['messages']
    : {},
  DateTimeFormats extends Record<
    string,
    unknown
  > = Options['datetimeFormats'] extends Record<string, unknown>
    ? Options['datetimeFormats']
    : {},
  NumberFormats extends Record<
    string,
    unknown
  > = Options['numberFormats'] extends Record<string, unknown>
    ? Options['numberFormats']
    : {},
  OptionLocale = Options['locale'] extends string ? Options['locale'] : Locale
>(
  options: Options,
  LegacyVueI18n?: any // eslint-disable-line @typescript-eslint/no-explicit-any
): (typeof options)['legacy'] extends true
  ? I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, true>
  : (typeof options)['legacy'] extends false
  ? I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, false>
  : I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, Legacy>

/**
 * Vue I18n factory
 *
 * @param options - An options, see the {@link I18nOptions}
 *
 * @typeParam Schema - The i18n resources (messages, datetimeFormats, numberFormats) schema, default {@link LocaleMessage}
 * @typeParam Locales - The locales of i18n resource schema, default `en-US`
 * @typeParam Legacy - Whether legacy mode is enabled or disabled, default `true`
 *
 * @returns {@link I18n} instance
 *
 * @remarks
 * If you use Legacy API mode, you need to specify {@link VueI18nOptions} and `legacy: true` option.
 *
 * If you use composition API mode, you need to specify {@link ComposerOptions}.
 *
 * @VueI18nSee [Getting Started](../guide/)
 * @VueI18nSee [Composition API](../guide/advanced/composition)
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
 *   legacy: false, // you must specify 'legacy: false' option
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
 * @VueI18nGeneral
 */
export function createI18n<
  Schema extends object = DefaultLocaleMessageSchema,
  Locales extends string | object = 'en-US',
  Legacy extends boolean = true,
  Options extends I18nOptions<
    SchemaParams<Schema, VueMessageType>,
    LocaleParams<Locales>
  > = I18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>>,
  Messages extends Record<string, unknown> = NonNullable<
    Options['messages']
  > extends Record<string, unknown>
    ? NonNullable<Options['messages']>
    : {},
  DateTimeFormats extends Record<string, unknown> = NonNullable<
    Options['datetimeFormats']
  > extends Record<string, unknown>
    ? NonNullable<Options['datetimeFormats']>
    : {},
  NumberFormats extends Record<string, unknown> = NonNullable<
    Options['numberFormats']
  > extends Record<string, unknown>
    ? NonNullable<Options['numberFormats']>
    : {},
  OptionLocale = Options['locale'] extends string ? Options['locale'] : Locale
>(
  options: Options,
  LegacyVueI18n?: any // eslint-disable-line @typescript-eslint/no-explicit-any
): (typeof options)['legacy'] extends true
  ? I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, true>
  : (typeof options)['legacy'] extends false
  ? I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, false>
  : I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, Legacy>

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function createI18n(options: any = {}, VueI18nLegacy?: any): any {
  type _I18n = I18n & I18nInternal

  if (__BRIDGE__) {
    _legacyVueI18n = VueI18nLegacy
  }

  // prettier-ignore
  const __legacyMode = __LITE__
    ? false
    :  __FEATURE_LEGACY_API__ && isBoolean(options.legacy)
      ? options.legacy
      : __FEATURE_LEGACY_API__
  // prettier-ignore
  const __globalInjection = isBoolean(options.globalInjection)
      ? options.globalInjection
      : true
  // prettier-ignore
  const __allowComposition = __LITE__
    ? true
    :  __FEATURE_LEGACY_API__ && __legacyMode
      ? !!options.allowComposition
      : true
  const __instances = new Map<ComponentInternalInstance, VueI18n | Composer>()
  const [globalScope, __global] = createGlobal(
    options,
    __legacyMode,
    VueI18nLegacy
  )
  const symbol: InjectionKey<I18n> | string = /* #__PURE__*/ makeSymbol(
    __DEV__ ? 'vue-i18n' : ''
  )

  function __getInstance<Instance extends VueI18n | Composer>(
    component: ComponentInternalInstance
  ): Instance | null {
    return (__instances.get(component) as unknown as Instance) || null
  }
  function __setInstance<Instance extends VueI18n | Composer>(
    component: ComponentInternalInstance,
    instance: Instance
  ): void {
    __instances.set(component, instance)
  }
  function __deleteInstance(component: ComponentInternalInstance): void {
    __instances.delete(component)
  }

  if (!__BRIDGE__) {
    const i18n = {
      // mode
      get mode(): I18nMode {
        return !__LITE__ && __FEATURE_LEGACY_API__ && __legacyMode
          ? 'legacy'
          : 'composition'
      },
      // allowComposition
      get allowComposition(): boolean {
        return __allowComposition
      },
      // install plugin
      async install(app: App, ...options: unknown[]): Promise<void> {
        if (
          !__BRIDGE__ &&
          (__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) &&
          !__NODE_JS__
        ) {
          app.__VUE_I18N__ = i18n as unknown as _I18n
        }

        // setup global provider
        app.__VUE_I18N_SYMBOL__ = symbol
        app.provide(app.__VUE_I18N_SYMBOL__, i18n as unknown as I18n)

        // set composer & vuei18n extend hook options from plugin options
        if (isPlainObject(options[0])) {
          const opts = options[0] as ExtendHooks
          ;(i18n as unknown as I18nInternal).__composerExtend =
            opts.__composerExtend
          ;(i18n as unknown as I18nInternal).__vueI18nExtend =
            opts.__vueI18nExtend
        }

        // global method and properties injection for Composition API
        if (!__legacyMode && __globalInjection) {
          injectGlobalFields(app, i18n.global as Composer)
        }

        // install built-in components and directive
        if (!__LITE__ && __FEATURE_FULL_INSTALL__) {
          applyNext(app, i18n as I18n, ...options)
        }

        // setup mixin for Legacy API
        if (!__LITE__ && __FEATURE_LEGACY_API__ && __legacyMode) {
          app.mixin(
            defineMixinNext(
              __global as unknown as VueI18n,
              (__global as unknown as VueI18nInternal).__composer as Composer,
              i18n as unknown as I18nInternal
            )
          )
        }

        // release global scope
        const unmountApp = app.unmount
        app.unmount = () => {
          i18n.dispose()
          unmountApp()
        }

        // setup vue-devtools plugin
        if ((__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) && !__NODE_JS__) {
          const ret = await enableDevTools(app, i18n as _I18n)
          if (!ret) {
            throw createI18nError(
              I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN
            )
          }
          const emitter: VueDevToolsEmitter =
            createEmitter<VueDevToolsEmitterEvents>()
          if (__legacyMode) {
            const _vueI18n = __global as unknown as VueI18nInternal
            _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter)
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const _composer = __global as any
            _composer[EnableEmitter] && _composer[EnableEmitter](emitter)
          }
          emitter.on('*', addTimelineEvent)
        }
      },
      // global accessor
      get global() {
        return __global
      },
      dispose(): void {
        globalScope.stop()
      },
      // @internal
      __instances,
      // @internal
      __getInstance,
      // @internal
      __setInstance,
      // @internal
      __deleteInstance
    }
    return i18n
  } else {
    // extend legacy VueI18n instance

    const i18n = (__global as any)[LegacyInstanceSymbol] // eslint-disable-line @typescript-eslint/no-explicit-any
    let _localeWatcher: Function | null = null
    Object.defineProperty(i18n, 'global', {
      get() {
        return __global
      }
    })
    Object.defineProperty(i18n, 'mode', {
      get() {
        return __legacyMode ? 'legacy' : 'composition'
      }
    })
    Object.defineProperty(i18n, 'allowComposition', {
      get() {
        return __allowComposition
      }
    })
    Object.defineProperty(i18n, '__instances', {
      get() {
        return __instances
      }
    })
    Object.defineProperty(i18n, 'install', {
      writable: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: (Vue: any, ...options: unknown[]) => {
        const version =
          (Vue && Vue.version && Number(Vue.version.split('.')[0])) || -1
        if (version !== 2) {
          throw createI18nError(I18nErrorCodes.BRIDGE_SUPPORT_VUE_2_ONLY)
        }

        __FEATURE_FULL_INSTALL__ && applyBridge(Vue, ...options)

        if (!__legacyMode && __globalInjection) {
          _localeWatcher = injectGlobalFieldsForBridge(
            Vue,
            i18n,
            __global as Composer
          )
        }
        Vue.mixin(defineMixinBridge(i18n, _legacyVueI18n))
      }
    })
    Object.defineProperty(i18n, 'dispose', {
      value: (): void => {
        _localeWatcher && _localeWatcher()
        globalScope.stop()
      }
    })
    const methodMap = {
      __getInstance,
      __setInstance,
      __deleteInstance
    }
    Object.keys(methodMap).forEach(
      key =>
        Object.defineProperty(i18n, key, { value: (methodMap as any)[key] }) // eslint-disable-line @typescript-eslint/no-explicit-any
    )
    return i18n
  }
}

export function useI18n<Options extends UseI18nOptions = UseI18nOptions>(
  options?: Options
): Composer<
  NonNullable<Options['messages']>,
  NonNullable<Options['datetimeFormats']>,
  NonNullable<Options['numberFormats']>,
  Options['locale'] extends unknown ? string : Options['locale']
>

/**
 * Use Composition API for Vue I18n
 *
 * @param options - An options, see {@link UseI18nOptions}
 *
 * @typeParam Schema - The i18n resources (messages, datetimeFormats, numberFormats) schema, default {@link LocaleMessage}
 * @typeParam Locales - The locales of i18n resource schema, default `en-US`
 *
 * @returns {@link Composer} instance
 *
 * @remarks
 * This function is mainly used by `setup`.
 *
 * If options are specified, Composer instance is created for each component and you can be localized on the component.
 *
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
 *
 * @VueI18nComposition
 */
export function useI18n<
  Schema = DefaultLocaleMessageSchema,
  Locales = 'en-US',
  Options extends UseI18nOptions<
    SchemaParams<Schema, VueMessageType>,
    LocaleParams<Locales>
  > = UseI18nOptions<
    SchemaParams<Schema, VueMessageType>,
    LocaleParams<Locales>
  >
>(
  options?: Options
): Composer<
  NonNullable<Options['messages']>,
  NonNullable<Options['datetimeFormats']>,
  NonNullable<Options['numberFormats']>,
  Options['locale'] extends unknown ? string : Options['locale']
>
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useI18n<
  Options extends UseI18nOptions = UseI18nOptions,
  Messages extends Record<string, unknown> = NonNullable<Options['messages']>,
  DateTimeFormats extends Record<string, unknown> = NonNullable<
    Options['datetimeFormats']
  >,
  NumberFormats extends Record<string, unknown> = NonNullable<
    Options['numberFormats']
  >,
  OptionLocale = NonNullable<Options['locale']>
>(options: Options = {} as Options) {
  const instance = getCurrentInstance()
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP)
  }
  if (
    !__BRIDGE__ &&
    !instance.isCE &&
    instance.appContext.app != null &&
    !instance.appContext.app.__VUE_I18N_SYMBOL__
  ) {
    throw createI18nError(I18nErrorCodes.NOT_INSLALLED)
  }

  if (__BRIDGE__) {
    if (_legacyVueI18n == null) {
      throw createI18nError(I18nErrorCodes.NOT_INSLALLED)
    }
  }

  const i18n = getI18nInstance(instance)
  const global = getGlobalComposer(i18n)
  const componentOptions = getComponentOptions(instance)
  const scope = getScope(options, componentOptions)

  if (!__LITE__ && __FEATURE_LEGACY_API__) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (i18n.mode === 'legacy' && !(options as any).__useComponent) {
      if (!i18n.allowComposition) {
        throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE)
      }
      return useI18nForLegacy(instance, scope, global, options)
    }
  }

  if (scope === 'global') {
    adjustI18nResources(global, options, componentOptions)
    return global as unknown as Composer<
      Messages,
      DateTimeFormats,
      NumberFormats,
      OptionLocale
    >
  }

  if (scope === 'parent') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let composer = getComposer(i18n, instance, (options as any).__useComponent)
    if (composer == null) {
      if (__DEV__) {
        warn(getWarnMessage(I18nWarnCodes.NOT_FOUND_PARENT_SCOPE))
      }
      composer = global as unknown as Composer
    }
    return composer as unknown as Composer<
      Messages,
      DateTimeFormats,
      NumberFormats,
      OptionLocale
    >
  }

  const i18nInternal = i18n as unknown as I18nInternal
  let composer = i18nInternal.__getInstance(instance)
  if (composer == null) {
    const composerOptions = assign({}, options) as ComposerOptions &
      ComposerInternalOptions

    if ('__i18n' in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n
    }

    if (global) {
      composerOptions.__root = global
    }

    composer = createComposer(composerOptions, _legacyVueI18n) as Composer
    if (i18nInternal.__composerExtend) {
      i18nInternal.__composerExtend(composer)
    }
    setupLifeCycle(i18nInternal, instance, composer)

    i18nInternal.__setInstance(instance, composer)
  }

  return composer as unknown as Composer<
    Messages,
    DateTimeFormats,
    NumberFormats,
    OptionLocale
  >
}

/**
 * Cast to VueI18n legacy compatible type
 *
 * @remarks
 * This API is provided only with [vue-i18n-bridge](https://vue-i18n.intlify.dev/guide/migration/ways.html#what-is-vue-i18n-bridge).
 *
 * The purpose of this function is to convert an {@link I18n} instance created with {@link createI18n | createI18n(legacy: true)} into a `vue-i18n@v8.x` compatible instance of `new VueI18n` in a TypeScript environment.
 *
 * @param i18n - An instance of {@link I18n}
 * @returns A i18n instance which is casted to {@link VueI18n} type
 *
 * @VueI18nTip
 * :new: provided by **vue-i18n-bridge only**
 *
 * @VueI18nGeneral
 */
export const castToVueI18n = /* #__PURE__*/ (
  i18n: I18n
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): VueI18n & { install: (Vue: any, options?: any) => void } => {
  if (!(__VUE_I18N_BRIDGE__ in i18n)) {
    throw createI18nError(I18nErrorCodes.NOT_COMPATIBLE_LEGACY_VUE_I18N)
  }
  return i18n as unknown as VueI18n & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    install: (Vue: any, options?: any) => void
  }
}

function createGlobal(
  options: I18nOptions,
  legacyMode: boolean,
  VueI18nLegacy: any // eslint-disable-line @typescript-eslint/no-explicit-any
): [EffectScope, VueI18n | Composer] {
  const scope = effectScope()
  if (!__BRIDGE__) {
    const obj =
      !__LITE__ && __FEATURE_LEGACY_API__ && legacyMode
        ? scope.run(() => createVueI18n(options, VueI18nLegacy))
        : scope.run(() => createComposer(options, VueI18nLegacy))
    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
    }
    return [scope, obj]
  } else {
    if (!isLegacyVueI18n(VueI18nLegacy)) {
      throw createI18nError(I18nErrorCodes.NOT_COMPATIBLE_LEGACY_VUE_I18N)
    }
    const obj = scope.run(() => createComposer(options, VueI18nLegacy))
    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
    }
    return [scope, obj]
  }
}

function getI18nInstance(instance: ComponentInternalInstance): I18n {
  if (!__BRIDGE__) {
    const i18n = inject(
      !instance.isCE
        ? instance.appContext.app.__VUE_I18N_SYMBOL__!
        : I18nInjectionKey
    )
    /* istanbul ignore if */
    if (!i18n) {
      throw createI18nError(
        !instance.isCE
          ? I18nErrorCodes.UNEXPECTED_ERROR
          : I18nErrorCodes.NOT_INSLALLED_WITH_PROVIDE
      )
    }
    return i18n
  } else {
    const vm = instance.proxy
    /* istanbul ignore if */
    if (vm == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
    }
    const i18n = (vm as any)._i18nBridgeRoot // eslint-disable-line @typescript-eslint/no-explicit-any
    /* istanbul ignore if */
    if (!i18n) {
      throw createI18nError(I18nErrorCodes.NOT_INSLALLED)
    }
    return i18n as I18n
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getScope(options: UseI18nOptions, componentOptions: any): I18nScope {
  // prettier-ignore
  return isEmptyObject(options)
    ? ('__i18n' in componentOptions)
      ? 'local'
      : 'global'
    : !options.useScope
      ? 'local'
      : options.useScope
}

function getGlobalComposer(i18n: I18n): Composer {
  // prettier-ignore
  return !__BRIDGE__
    ? i18n.mode === 'composition'
      ? (i18n.global as unknown as Composer)
      : (i18n.global as unknown as VueI18nInternal).__composer
    : (i18n.global as unknown as Composer)
}

function getComposer(
  i18n: I18n,
  target: ComponentInternalInstance,
  useComponent = false
): Composer | null {
  let composer: Composer | null = null
  const root = target.root
  let current: ComponentInternalInstance | null = target.parent
  while (current != null) {
    const i18nInternal = i18n as unknown as I18nInternal
    if (i18n.mode === 'composition') {
      composer = i18nInternal.__getInstance(current)
    } else {
      if (!__LITE__ && __FEATURE_LEGACY_API__) {
        const vueI18n = i18nInternal.__getInstance(current)
        if (vueI18n != null) {
          composer = (vueI18n as VueI18n & VueI18nInternal)
            .__composer as Composer
          if (
            useComponent &&
            composer &&
            !(composer as any)[InejctWithOption] // eslint-disable-line @typescript-eslint/no-explicit-any
          ) {
            composer = null
          }
        }
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
  let emitter: VueDevToolsEmitter | null = null

  if (__BRIDGE__) {
    // assign legacy VueI18n instance to Vue2 instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = target.proxy as any
    if (vm == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _i18n = (composer as any)[LegacyInstanceSymbol]
    if (_i18n === i18n) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
    }
    vm._i18n = _i18n
    vm._i18n_bridge = true

    // browser only
    if (inBrowser) {
      vm._i18nWatcher = vm._i18n.watchI18nData()
      if (vm._i18n._sync) {
        vm._localeWatcher = vm._i18n.watchLocale()
      }
    }

    let subscribing = false
    onBeforeMount(() => {
      vm._i18n.subscribeDataChanging(vm)
      subscribing = true
    })

    onUnmounted(() => {
      if (subscribing) {
        vm._i18n.unsubscribeDataChanging(vm)
        subscribing = false
      }
      if (vm._i18nWatcher) {
        vm._i18nWatcher()
        vm._i18n.destroyVM()
        delete vm._i18nWatcher
      }
      if (vm._localeWatcher) {
        vm._localeWatcher()
        delete vm._localeWatcher
      }
      delete vm._i18n_bridge
      delete vm._i18n
    })
  } else {
    onMounted(() => {
      // inject composer instance to DOM for intlify-devtools
      if (
        (__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) &&
        !__NODE_JS__ &&
        target.vnode.el
      ) {
        target.vnode.el.__VUE_I18N__ = composer
        emitter = createEmitter<VueDevToolsEmitterEvents>()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const _composer = composer as any
        _composer[EnableEmitter] && _composer[EnableEmitter](emitter)
        emitter.on('*', addTimelineEvent)
      }
    }, target)

    onUnmounted(() => {
      // remove composer instance from DOM for intlify-devtools
      if (
        (__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) &&
        !__NODE_JS__ &&
        target.vnode.el &&
        target.vnode.el.__VUE_I18N__
      ) {
        emitter && emitter.off('*', addTimelineEvent)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const _composer = composer as any
        _composer[DisableEmitter] && _composer[DisableEmitter]()
        delete target.vnode.el.__VUE_I18N__
      }
      i18n.__deleteInstance(target)
    }, target)
  }
}

function useI18nForLegacy(
  instance: ComponentInternalInstance,
  scope: I18nScope,
  root: Composer,
  options: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any
): Composer {
  type Message = VueMessageType

  const isLocalScope = scope === 'local'
  const _composer = shallowRef<Composer | null>(null)

  if (
    isLocalScope &&
    instance.proxy &&
    !(instance.proxy.$options.i18n || instance.proxy.$options.__i18n)
  ) {
    throw createI18nError(
      I18nErrorCodes.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION
    )
  }

  const _inheritLocale = isBoolean(options.inheritLocale)
    ? options.inheritLocale
    : !isString(options.locale)

  const _locale = ref<Locale>(
    // prettier-ignore
    !isLocalScope || _inheritLocale
    ? root.locale.value
    : isString(options.locale)
      ? options.locale
      : DEFAULT_LOCALE
  )

  const _fallbackLocale = ref<FallbackLocale>(
    // prettier-ignore
    !isLocalScope || _inheritLocale
      ? root.fallbackLocale.value
      : isString(options.fallbackLocale) ||
        isArray(options.fallbackLocale) ||
        isPlainObject(options.fallbackLocale) ||
        options.fallbackLocale === false
        ? options.fallbackLocale
        : _locale.value
  )

  const _messages = ref<LocaleMessages<LocaleMessage<Message>>>(
    getLocaleMessages<LocaleMessages<LocaleMessage<Message>>>(
      _locale.value as Locale,
      options
    )
  )

  // prettier-ignore
  const _datetimeFormats = ref<DateTimeFormatsType>(
    isPlainObject(options.datetimeFormats)
      ? options.datetimeFormats
      : { [_locale.value]: {} }
  )

  // prettier-ignore
  const _numberFormats = ref<NumberFormatsType>(
    isPlainObject(options.numberFormats)
      ? options.numberFormats
      : { [_locale.value]: {} }
  )

  // prettier-ignore
  const _missingWarn = isLocalScope
    ? root.missingWarn
    : isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      : true

  // prettier-ignore
  const _fallbackWarn = isLocalScope
    ? root.fallbackWarn
    : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
      ? options.fallbackWarn
      : true

  // prettier-ignore
  const _fallbackRoot = isLocalScope
    ? root.fallbackRoot
    : isBoolean(options.fallbackRoot)
      ? options.fallbackRoot
      : true

  // configure fall back to root
  const _fallbackFormat = !!options.fallbackFormat

  // runtime missing
  const _missing = isFunction(options.missing) ? options.missing : null

  // postTranslation handler
  const _postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null

  // prettier-ignore
  const _warnHtmlMessage = isLocalScope
    ? root.warnHtmlMessage
    : isBoolean(options.warnHtmlMessage)
      ? options.warnHtmlMessage
      : true

  const _escapeParameter = !!options.escapeParameter

  // prettier-ignore
  const _modifiers = isLocalScope
    ? root.modifiers
    : isPlainObject(options.modifiers)
      ? options.modifiers
      : {}

  // pluralRules
  const _pluralRules = options.pluralRules || (isLocalScope && root.pluralRules)

  // track reactivity
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ]
  }

  // locale
  const locale = computed({
    get: () => {
      return _composer.value ? _composer.value.locale.value : _locale.value
    },
    set: val => {
      if (_composer.value) {
        _composer.value.locale.value = val
      }
      _locale.value = val
    }
  })

  // fallbackLocale
  const fallbackLocale = computed({
    get: () => {
      return _composer.value
        ? _composer.value.fallbackLocale.value
        : _fallbackLocale.value
    },
    set: val => {
      if (_composer.value) {
        _composer.value.fallbackLocale.value = val
      }
      _fallbackLocale.value = val
    }
  })

  // messages
  const messages = computed<LocaleMessages<LocaleMessage<Message>, Message>>(
    () => {
      if (_composer.value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return _composer.value.messages.value as any
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return _messages.value as any
      }
    }
  )

  const datetimeFormats = computed<DateTimeFormatsType>(
    () => _datetimeFormats.value
  )

  const numberFormats = computed<NumberFormatsType>(() => _numberFormats.value)

  function getPostTranslationHandler(): PostTranslationHandler<Message> | null {
    return _composer.value
      ? _composer.value.getPostTranslationHandler()
      : _postTranslation
  }

  function setPostTranslationHandler(
    handler: PostTranslationHandler<Message> | null
  ): void {
    if (_composer.value) {
      _composer.value.setPostTranslationHandler(handler)
    }
  }

  function getMissingHandler(): MissingHandler | null {
    return _composer.value ? _composer.value.getMissingHandler() : _missing
  }

  function setMissingHandler(handler: MissingHandler | null): void {
    if (_composer.value) {
      _composer.value.setMissingHandler(handler)
    }
  }

  function warpWithDeps<R>(fn: () => unknown) {
    trackReactivityValues()
    return fn() as R
  }

  function t(...args: unknown[]): string {
    return _composer.value
      ? warpWithDeps<string>(
          () => Reflect.apply(_composer.value!.t, null, [...args]) as string
        )
      : warpWithDeps<string>(() => '')
  }

  function rt(...args: unknown[]): string {
    return _composer.value
      ? Reflect.apply(_composer.value.rt, null, [...args])
      : ''
  }

  function d(...args: unknown[]): string {
    return _composer.value
      ? warpWithDeps<string>(
          () => Reflect.apply(_composer.value!.d, null, [...args]) as string
        )
      : warpWithDeps<string>(() => '')
  }

  function n(...args: unknown[]): string {
    return _composer.value
      ? warpWithDeps<string>(
          () => Reflect.apply(_composer.value!.n, null, [...args]) as string
        )
      : warpWithDeps<string>(() => '')
  }

  function tm(key: Path): LocaleMessageValue<Message> | {} {
    return _composer.value ? _composer.value.tm(key) : {}
  }

  function te(key: Path, locale?: Locale): boolean {
    return _composer.value ? _composer.value.te(key, locale) : false
  }

  function getLocaleMessage(locale: Locale): LocaleMessage<Message> {
    return _composer.value ? _composer.value.getLocaleMessage(locale) : {}
  }

  function setLocaleMessage(locale: Locale, message: LocaleMessage<Message>) {
    if (_composer.value) {
      _composer.value.setLocaleMessage(locale, message)
      _messages.value[locale] = message
    }
  }

  function mergeLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ): void {
    if (_composer.value) {
      _composer.value.mergeLocaleMessage(locale, message)
    }
  }

  function getDateTimeFormat(locale: Locale): DateTimeFormat {
    return _composer.value ? _composer.value.getDateTimeFormat(locale) : {}
  }

  function setDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    if (_composer.value) {
      _composer.value.setDateTimeFormat(locale, format)
      _datetimeFormats.value[locale] = format
    }
  }

  function mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    if (_composer.value) {
      _composer.value.mergeDateTimeFormat(locale, format)
    }
  }

  function getNumberFormat(locale: Locale): NumberFormat {
    return _composer.value ? _composer.value.getNumberFormat(locale) : {}
  }

  function setNumberFormat(locale: Locale, format: NumberFormat): void {
    if (_composer.value) {
      _composer.value.setNumberFormat(locale, format)
      _numberFormats.value[locale] = format
    }
  }

  function mergeNumberFormat(locale: Locale, format: NumberFormat): void {
    if (_composer.value) {
      _composer.value.mergeNumberFormat(locale, format)
    }
  }

  const wrapper = {
    get id(): number {
      return _composer.value ? _composer.value.id : -1
    },
    locale,
    fallbackLocale,
    messages,
    datetimeFormats,
    numberFormats,
    get inheritLocale(): boolean {
      return _composer.value ? _composer.value.inheritLocale : _inheritLocale
    },
    set inheritLocale(val: boolean) {
      if (_composer.value) {
        _composer.value.inheritLocale = val
      }
    },
    get availableLocales(): Locale[] {
      return _composer.value
        ? _composer.value.availableLocales
        : Object.keys(_messages.value)
    },
    get modifiers(): LinkedModifiers {
      return (
        _composer.value ? _composer.value.modifiers : _modifiers
      ) as LinkedModifiers
    },
    get pluralRules(): PluralizationRules {
      return (
        _composer.value ? _composer.value.pluralRules : _pluralRules
      ) as PluralizationRules
    },
    get isGlobal(): boolean {
      return _composer.value ? _composer.value.isGlobal : false
    },
    get missingWarn(): boolean | RegExp {
      return _composer.value ? _composer.value.missingWarn : _missingWarn
    },
    set missingWarn(val: boolean | RegExp) {
      if (_composer.value) {
        _composer.value.missingWarn = val
      }
    },
    get fallbackWarn(): boolean | RegExp {
      return _composer.value ? _composer.value.fallbackWarn : _fallbackWarn
    },
    set fallbackWarn(val: boolean | RegExp) {
      if (_composer.value) {
        _composer.value.missingWarn = val
      }
    },
    get fallbackRoot(): boolean {
      return _composer.value ? _composer.value.fallbackRoot : _fallbackRoot
    },
    set fallbackRoot(val: boolean) {
      if (_composer.value) {
        _composer.value.fallbackRoot = val
      }
    },
    get fallbackFormat(): boolean {
      return _composer.value ? _composer.value.fallbackFormat : _fallbackFormat
    },
    set fallbackFormat(val: boolean) {
      if (_composer.value) {
        _composer.value.fallbackFormat = val
      }
    },
    get warnHtmlMessage(): boolean {
      return _composer.value
        ? _composer.value.warnHtmlMessage
        : _warnHtmlMessage
    },
    set warnHtmlMessage(val: boolean) {
      if (_composer.value) {
        _composer.value.warnHtmlMessage = val
      }
    },
    get escapeParameter(): boolean {
      return _composer.value
        ? _composer.value.escapeParameter
        : _escapeParameter
    },
    set escapeParameter(val: boolean) {
      if (_composer.value) {
        _composer.value.escapeParameter = val
      }
    },
    t,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    rt,
    d,
    n,
    tm,
    te,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getDateTimeFormat,
    setDateTimeFormat,
    mergeDateTimeFormat,
    getNumberFormat,
    setNumberFormat,
    mergeNumberFormat
  }

  function sync(composer: Composer): void {
    composer.locale.value = _locale.value
    composer.fallbackLocale.value = _fallbackLocale.value
    Object.keys(_messages.value).forEach(locale => {
      composer.mergeLocaleMessage(locale, _messages.value[locale])
    })
    Object.keys(_datetimeFormats.value).forEach(locale => {
      composer.mergeDateTimeFormat(locale, _datetimeFormats.value[locale])
    })
    Object.keys(_numberFormats.value).forEach(locale => {
      composer.mergeNumberFormat(locale, _numberFormats.value[locale])
    })
    composer.escapeParameter = _escapeParameter
    composer.fallbackFormat = _fallbackFormat
    composer.fallbackRoot = _fallbackRoot
    composer.fallbackWarn = _fallbackWarn
    composer.missingWarn = _missingWarn
    composer.warnHtmlMessage = _warnHtmlMessage
  }

  onBeforeMount(() => {
    if (instance.proxy == null || instance.proxy.$i18n == null) {
      throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const composer = (_composer.value = (instance.proxy.$i18n as any)
      .__composer as Composer)
    if (scope === 'global') {
      _locale.value = composer.locale.value
      _fallbackLocale.value = composer.fallbackLocale.value
      _messages.value = composer.messages.value
      _datetimeFormats.value = composer.datetimeFormats.value
      _numberFormats.value = composer.numberFormats.value
    } else if (isLocalScope) {
      sync(composer)
    }
  })

  return wrapper as unknown as Composer
}

/**
 * Exported global composer instance
 *
 * @remarks
 * This interface is the [global composer](general#global) that is provided interface that is injected into each component with `app.config.globalProperties`.
 *
 * @VueI18nGeneral
 */
export interface ExportedGlobalComposer {
  /**
   * Locale
   *
   * @remarks
   * This property is proxy-like property for `Composer#locale`. About details, see the [Composer#locale](composition#locale)
   */
  locale: Locale
  /**
   * Fallback locale
   *
   * @remarks
   * This property is proxy-like property for `Composer#fallbackLocale`. About details, see the [Composer#fallbackLocale](composition#fallbacklocale)
   */
  fallbackLocale: FallbackLocale
  /**
   * Available locales
   *
   * @remarks
   * This property is proxy-like property for `Composer#availableLocales`. About details, see the [Composer#availableLocales](composition#availablelocales)
   */
  readonly availableLocales: Locale[]
}

const globalExportProps = [
  'locale',
  'fallbackLocale',
  'availableLocales'
] as const
const globalExportMethods = !__LITE__
  ? ['t', 'rt', 'd', 'n', 'tm', 'te']
  : ['t']

function injectGlobalFields(app: App, composer: Composer): void {
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
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc)
  })
}

function injectGlobalFieldsForBridge(
  Vue: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  i18n: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  composer: Composer
): Function {
  // The composition mode in vue-i18n-bridge is `$18n` is the VueI18n instance.
  // so we need to tell composer to change the locale.
  // If we don't do, things like `$t` that are injected will not be reacted.
  const watcher = i18n.watchLocale(composer) as Function

  // define fowardcompatible vue-i18n-next inject fields with `globalInjection`
  Vue.prototype.$t = function (...args: unknown[]) {
    return Reflect.apply(composer.t, composer, [...args])
  }

  Vue.prototype.$d = function (...args: unknown[]) {
    return Reflect.apply(composer.d, composer, [...args])
  }

  Vue.prototype.$n = function (...args: unknown[]) {
    return Reflect.apply(composer.n, composer, [...args])
  }

  return watcher
}

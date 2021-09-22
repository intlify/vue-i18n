import {
  inject,
  onBeforeMount,
  onMounted,
  onUnmounted,
  InjectionKey,
  getCurrentInstance,
  isRef
} from 'vue'
import {
  isEmptyObject,
  isObject,
  isBoolean,
  warn,
  makeSymbol,
  createEmitter,
  assign
} from '@intlify/shared'
import { getLocaleMessages, createComposer } from './composer'
import { createVueI18n } from './legacy'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { I18nErrorCodes, createI18nError } from './errors'
import { EnableEmitter, DisableEmitter, LegacyInstanceSymbol } from './symbols'
import { apply } from './plugin'
import { defineMixin as defineMixinNext } from './mixins/next'
import { defineMixin as defineMixinBridge } from './mixins/bridge'
import { enableDevTools, addTimelineEvent } from './devtools'
import { isLegacyVueI18n } from './utils'

import type { ComponentInternalInstance, App } from 'vue'
import type {
  Locale,
  FallbackLocale,
  SchemaParams,
  LocaleParams
} from '@intlify/core-base'
import type {
  VueDevToolsEmitter,
  VueDevToolsEmitterEvents
} from '@intlify/vue-devtools'
import type {
  VueMessageType,
  DefaultLocaleMessageSchema,
  DefaultDateTimeFormatSchema,
  DefaultNumberFormatSchema,
  Composer,
  ComposerOptions,
  ComposerInternalOptions
} from './composer'
import type { VueI18n, VueI18nOptions, VueI18nInternal } from './legacy'

declare module '@vue/runtime-core' {
  // eslint-disable-next-line
  interface App<HostElement = any> {
    __VUE_I18N__?: I18n & I18nInternal
    __VUE_I18N_SYMBOL__?: InjectionKey<I18n> | string
  }
}

// for bridge
let _legacyVueI18n: any = /* #__PURE__*/ null // eslint-disable-line @typescript-eslint/no-explicit-any
let _legacyI18n: I18n | null = /* #__PURE__*/ null // eslint-disable-line @typescript-eslint/no-explicit-any

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
   * @defaultValue `false`
   */
  globalInjection?: boolean
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
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  OptionLocale = Locale,
  Legacy = boolean
> {
  /**
   * Vue I18n API mode
   *
   * @remarks
   * If you specified `legacy: true` option in `createI18n`, return `legacy`, else `composition`
   *
   * @defaultValue `'composition'`
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
   * Install entry point
   *
   * @param app - A target Vue app instance
   * @param options - An install options
   */
  install(app: App, ...options: unknown[]): void
}

/**
 * I18n interface for internal usage
 *
 * @internal
 */
export interface I18nInternal<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
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
  Messages = Options['messages'] extends object ? Options['messages'] : {},
  DateTimeFormats = Options['datetimeFormats'] extends object
    ? Options['datetimeFormats']
    : {},
  NumberFormats = Options['numberFormats'] extends object
    ? Options['numberFormats']
    : {},
  OptionLocale = Options['locale'] extends string ? Options['locale'] : Locale
>(
  options: Options
): I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, Legacy>

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
 * If you use Legacy API mode, you need toto specify {@link VueI18nOptions} and `legacy: true` option.
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
  Messages = Options['messages'] extends object ? Options['messages'] : {},
  DateTimeFormats = Options['datetimeFormats'] extends object
    ? Options['datetimeFormats']
    : {},
  NumberFormats = Options['numberFormats'] extends object
    ? Options['numberFormats']
    : {},
  OptionLocale = Options['locale'] extends string ? Options['locale'] : Locale
>(
  options: Options
): I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, Legacy>

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function createI18n(options: any = {}, VueI18nLegacy?: any): any {
  type _I18n = I18n & I18nInternal

  if (__BRIDGE__ && _legacyI18n) {
    __DEV__ &&
      warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORT_MULTI_I18N_INSTANCE))
    return _legacyI18n
  }
  if (__BRIDGE__) {
    _legacyVueI18n = VueI18nLegacy
  }

  // prettier-ignore
  const __legacyMode = __LITE__
    ? false
    :  __FEATURE_LEGACY_API__ && isBoolean(options.legacy)
      ? options.legacy
      : __FEATURE_LEGACY_API__
  const __globalInjection = /* #__PURE__*/ !!options.globalInjection
  const __instances = new Map<ComponentInternalInstance, VueI18n | Composer>()
  const __global = createGlobal(options, __legacyMode, VueI18nLegacy)
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
        if (!__BRIDGE__) {
          app.__VUE_I18N_SYMBOL__ = symbol
          app.provide(app.__VUE_I18N_SYMBOL__, i18n as unknown as I18n)
        }

        // global method and properties injection for Composition API
        if (!__BRIDGE__ && !__legacyMode && __globalInjection) {
          injectGlobalFields(app, i18n.global as Composer)
        }

        // install built-in components and directive
        if (!__BRIDGE__ && !__LITE__ && __FEATURE_FULL_INSTALL__) {
          apply(app, i18n as I18n, ...options)
        }

        // setup mixin for Legacy API
        if (
          !__BRIDGE__ &&
          !__LITE__ &&
          __FEATURE_LEGACY_API__ &&
          __legacyMode
        ) {
          app.mixin(
            defineMixinNext(
              __global as unknown as VueI18n,
              (__global as unknown as VueI18nInternal).__composer as Composer,
              i18n as unknown as I18nInternal
            )
          )
        }

        // setup vue-devtools plugin
        if (
          !__BRIDGE__ &&
          (__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) &&
          !__NODE_JS__
        ) {
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
    Object.defineProperty(i18n, '__instances', {
      get() {
        return __instances
      }
    })
    Object.defineProperty(i18n, 'install', {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: (Vue: any) => {
        const version =
          (Vue && Vue.version && Number(Vue.version.split('.')[0])) || -1
        if (version !== 2) {
          throw createI18nError(I18nErrorCodes.BRIDGE_SUPPORT_VUE_2_ONLY)
        }
        Vue.mixin(defineMixinBridge(i18n, _legacyVueI18n))
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
    _legacyI18n = i18n
    return i18n
  }
}

export function useI18n<Options extends UseI18nOptions = UseI18nOptions>(
  options?: Options
): Composer<
  NonNullable<Options['messages']>,
  NonNullable<Options['datetimeFormats']>,
  NonNullable<Options['numberFormats']>,
  NonNullable<Options['locale']>
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
  NonNullable<Options['locale']>
>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useI18n<
  Options extends UseI18nOptions = UseI18nOptions,
  Messages = NonNullable<Options['messages']>,
  DateTimeFormats = NonNullable<Options['datetimeFormats']>,
  NumberFormats = NonNullable<Options['numberFormats']>,
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
    if (_legacyVueI18n == null || _legacyI18n == null) {
      throw createI18nError(I18nErrorCodes.NOT_INSLALLED)
    }
  }

  const i18n = getI18nInstance(instance)
  const global = getGlobalComposer(i18n)
  const componentOptions = getComponentOptions(instance)
  const scope = getScope(options, componentOptions)

  if (scope === 'global') {
    adjustI18nResources(global, options, componentOptions)
    return global as Composer<
      Messages,
      DateTimeFormats,
      NumberFormats,
      OptionLocale
    >
  }

  if (scope === 'parent') {
    let composer = getComposer(i18n, instance)
    if (composer == null) {
      if (__DEV__) {
        warn(getWarnMessage(I18nWarnCodes.NOT_FOUND_PARENT_SCOPE))
      }
      composer = global as unknown as Composer
    }
    return composer as Composer<
      Messages,
      DateTimeFormats,
      NumberFormats,
      OptionLocale
    >
  }

  // scope 'local' case
  if (i18n.mode === 'legacy') {
    throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE)
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
    setupLifeCycle(i18nInternal, instance, composer)

    i18nInternal.__setInstance(instance, composer)
  }

  return composer as Composer<
    Messages,
    DateTimeFormats,
    NumberFormats,
    OptionLocale
  >
}

function createGlobal(
  options: I18nOptions,
  legacyMode: boolean,
  VueI18nLegacy: any // eslint-disable-line @typescript-eslint/no-explicit-any
): VueI18n | Composer {
  if (!__BRIDGE__) {
    return !__LITE__ && __FEATURE_LEGACY_API__ && legacyMode
      ? createVueI18n(options, VueI18nLegacy)
      : createComposer(options, VueI18nLegacy)
  } else {
    if (!isLegacyVueI18n(VueI18nLegacy)) {
      throw createI18nError(I18nErrorCodes.NOT_COMPATIBLE_LEGACY_VUE_I18N)
    }
    return createComposer(options, VueI18nLegacy)
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
    console.log('getIntance', vm, i18n)
    return i18n as I18n
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComponentOptions(instance: ComponentInternalInstance): any {
  return !__BRIDGE__ ? instance.type : instance.proxy!.$options
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

function adjustI18nResources(
  global: Composer,
  options: UseI18nOptions,
  componentOptions: any // eslint-disable-line @typescript-eslint/no-explicit-any
): void {
  let messages = isObject(options.messages) ? options.messages : {}
  if ('__i18nGlobal' in componentOptions) {
    messages = getLocaleMessages(global.locale.value as Locale, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    })
  }
  // merge locale messages
  const locales = Object.keys(messages)
  if (locales.length) {
    locales.forEach(locale => {
      global.mergeLocaleMessage(locale, messages[locale])
    })
  }
  if (!__LITE__) {
    // merge datetime formats
    if (isObject(options.datetimeFormats)) {
      const locales = Object.keys(options.datetimeFormats)
      if (locales.length) {
        locales.forEach(locale => {
          global.mergeDateTimeFormat(locale, options.datetimeFormats![locale])
        })
      }
    }
    // merge number formats
    if (isObject(options.numberFormats)) {
      const locales = Object.keys(options.numberFormats)
      if (locales.length) {
        locales.forEach(locale => {
          global.mergeNumberFormat(locale, options.numberFormats![locale])
        })
      }
    }
  }
}

function getComposer(
  i18n: I18n,
  target: ComponentInternalInstance
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
    vm._i18nWatcher = vm._i18n.watchI18nData()
    if (vm._i18n._sync) {
      vm._localeWatcher = vm._i18n.watchLocale()
    }

    let subscribing = false
    onBeforeMount(() => {
      vm._i18n.subscribeDataChanging(vm)
      subscribing = true
    }, target)

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
    }, target)
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
const globalExportMethods = !__LITE__ ? ['t', 'rt', 'd', 'n', 'tm'] : ['t']

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

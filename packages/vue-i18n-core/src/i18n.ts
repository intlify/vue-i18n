import {
  assign,
  createEmitter,
  isBoolean,
  isNumber,
  isEmptyObject,
  isPlainObject,
  makeSymbol,
  warn
} from '@intlify/shared'
import {
  effectScope,
  getCurrentScope,
  inject,
  isRef,
  onScopeDispose,
  // @ts-ignore -- vue 3.6-beta has not still exported `useInstanceOption`
  useInstanceOption,
  provide
} from 'vue'
import { createComposer } from './composer'
import { addTimelineEvent, enableDevTools } from './devtools'
import { I18nErrorCodes, createI18nError } from './errors'
import { apply as applyPlugin } from './plugin/next'
import { DisposeSymbol, EnableEmitter } from './symbols'
import { adjustI18nResources } from './utils'
import { I18nWarnCodes, getWarnMessage } from './warnings'

import type { FallbackLocale, Locale, LocaleParams, SchemaParams } from '@intlify/core-base'
import type { VueDevToolsEmitter, VueDevToolsEmitterEvents } from '@intlify/devtools-types'
import type { App, EffectScope, InjectionKey } from 'vue'
import type {
  Composer,
  ComposerInternalOptions,
  ComposerOptions,
  CustomBlocks,
  DefaultDateTimeFormatSchema,
  DefaultLocaleMessageSchema,
  DefaultNumberFormatSchema,
  VueMessageType
} from './composer'
import type { Disposer } from './types'

/**
 * I18n Options for `createI18n`
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
  Options = ComposerOptions<Schema, Locales>
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
   * Whether to inject global properties & functions into for each component.
   *
   * @remarks
   * If set to `true`, then properties and methods prefixed with `$` are injected into Vue Component.
   *
   * See about:
   * - [Implicit with injected properties and functions](../../../guide/advanced/composition#implicit-with-injected-properties-and-functions)
   * - {@link ComponentCustomProperties
   *
   * @default `true`
   */
  globalInjection?: boolean
}

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
  OptionLocale = Locale
> {
  // prettier-ignore
  /**
   * The property accessible to the global Composer instance
   *
   * An instance of this property is **global scope***.
   */
  readonly global: Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
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

export type ComposerExtender = (composer: Composer) => Disposer | undefined

/**
 * The hooks that give to extend Composer (Composition API)
 * This hook is mainly for vue-i18n-routing and nuxt i18n.
 *
 * @internal
 */
type ExtendHooks = {
  __composerExtend?: ComposerExtender
}

/**
 * Composer entry for DevTools
 *
 * @internal
 */
export interface ComposerEntry<
  Messages extends Record<string, unknown> = {},
  DateTimeFormats extends Record<string, unknown> = {},
  NumberFormats extends Record<string, unknown> = {},
  OptionLocale = Locale
> {
  composer: Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  label: string
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
  __instances: Map<number, ComposerEntry<Messages, DateTimeFormats, NumberFormats, OptionLocale>>
  __getInstance(
    uid: number
  ): ComposerEntry<Messages, DateTimeFormats, NumberFormats, OptionLocale> | null
  __setInstance(
    uid: number,
    entry: ComposerEntry<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  ): void
  __deleteInstance(uid: number): void
  __composerExtend?: ComposerExtender
}

/**
 * I18n Scope
 *
 * See about:
 * - {@link ComposerAdditionalOptions#useScope}
 * - {@link useI18n}
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
 * See about:
 * - {@link useI18n}
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
  Options extends ComposerOptions<Schema, Locales> = ComposerOptions<Schema, Locales>
> = ComposerAdditionalOptions & Options

/**
 * Composer additional options for `useI18n`
 *
 * @remarks
 * `ComposerAdditionalOptions` is extend for {@link ComposerOptions}, so you can specify these options.
 *
 * See about:
 * - {@link useI18n}
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

/**
 * Injection key for Composer scope propagation
 *
 * @internal
 */
const I18nComposerKey: InjectionKey<Composer> = /* #__PURE__*/ Symbol('vue-i18n-composer')

export function createI18n<
  Options extends I18nOptions = I18nOptions,
  Messages extends Record<string, unknown> = Options['messages'] extends Record<string, unknown>
    ? Options['messages']
    : {},
  DateTimeFormats extends Record<string, unknown> = Options['datetimeFormats'] extends Record<
    string,
    unknown
  >
    ? Options['datetimeFormats']
    : {},
  NumberFormats extends Record<string, unknown> = Options['numberFormats'] extends Record<
    string,
    unknown
  >
    ? Options['numberFormats']
    : {},
  OptionLocale = Options['locale'] extends string ? Options['locale'] : Locale
>(options: Options): I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>

/**
 * Vue I18n factory
 *
 * @param options - An options, see the {@link I18nOptions}
 *
 * @typeParam Schema - The i18n resources (messages, datetimeFormats, numberFormats) schema, default {@link LocaleMessage}
 * @typeParam Locales - The locales of i18n resource schema, default `en-US`
 *
 * @returns {@link I18n} instance
 *
 * See about:
 * - [Getting Started](../../../guide/essentials/started)
 * - [Composition API](../../../guide/advanced/composition)
 *
 * @example
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
 * @VueI18nGeneral
 */
export function createI18n<
  Schema extends object = DefaultLocaleMessageSchema,
  Locales extends string | object = 'en-US',
  Options extends I18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>> =
    I18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>>,
  Messages extends Record<string, unknown> = NonNullable<Options['messages']> extends Record<
    string,
    unknown
  >
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
>(options: Options): I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>

export function createI18n(options: any = {}): any {
  type _I18n = I18n & I18nInternal

  // prettier-ignore
  const __globalInjection = isBoolean(options.globalInjection)
    ? options.globalInjection
    : true
  const __instances = new Map<number, ComposerEntry>()
  const [globalScope, __global] = createGlobal(options)
  const symbol: InjectionKey<I18n> | string = /* #__PURE__*/ makeSymbol(__DEV__ ? 'vue-i18n' : '')

  function __getInstance(uid: number): ComposerEntry | null {
    return __instances.get(uid) || null
  }

  function __setInstance(uid: number, entry: ComposerEntry): void {
    __instances.set(uid, entry)
  }

  function __deleteInstance(uid: number): void {
    __instances.delete(uid)
  }

  const i18n = {
    // install plugin
    async install(app: App, ...options: unknown[]): Promise<void> {
      if ((__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) && !__NODE_JS__) {
        app.__VUE_I18N__ = i18n as unknown as _I18n
      }

      // setup global provider
      app.__VUE_I18N_SYMBOL__ = symbol
      app.provide(app.__VUE_I18N_SYMBOL__, i18n as unknown as I18n)
      // Also provide with I18nInjectionKey for useI18n inject
      app.provide(I18nInjectionKey, i18n as unknown as I18n)

      // set composer extend hook options from plugin options
      if (isPlainObject(options[0])) {
        const opts = options[0] as ExtendHooks
        // Plugin options cannot be passed directly to the function that creates Composer
        // so we keep it temporary
        ;(i18n as unknown as I18nInternal).__composerExtend = opts.__composerExtend
      }

      // global method and properties injection for Composition API
      let globalReleaseHandler: ReturnType<typeof injectGlobalFields> | null = null
      if (__globalInjection) {
        globalReleaseHandler = injectGlobalFields(app, i18n.global as Composer)
      }

      // install built-in components and directive
      if (!__LITE__ && __FEATURE_FULL_INSTALL__) {
        applyPlugin(app, ...options)
      }

      // release global scope
      const unmountApp = app.unmount
      app.unmount = () => {
        globalReleaseHandler?.()
        i18n.dispose()
        unmountApp()
      }

      // setup vue-devtools plugin
      if ((__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) && !__NODE_JS__) {
        const ret = await enableDevTools(app, i18n as _I18n)
        if (!ret) {
          throw createI18nError(I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN)
        }
        const emitter: VueDevToolsEmitter = createEmitter<VueDevToolsEmitterEvents>()

        const _composer = __global as any
        _composer[EnableEmitter]?.(emitter)
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
  Options extends UseI18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>> =
    UseI18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>>
>(
  options?: Options
): Composer<
  NonNullable<Options['messages']>,
  NonNullable<Options['datetimeFormats']>,
  NonNullable<Options['numberFormats']>,
  NonNullable<Options['locale']>
>

export function useI18n<
  Options extends UseI18nOptions = UseI18nOptions,
  Messages extends Record<string, unknown> = NonNullable<Options['messages']>,
  DateTimeFormats extends Record<string, unknown> = NonNullable<Options['datetimeFormats']>,
  NumberFormats extends Record<string, unknown> = NonNullable<Options['numberFormats']>,
  OptionLocale = NonNullable<Options['locale']>
>(options: Options = {} as Options) {
  // Get instance info via useInstanceOption (Vue 3.6+)
  const { hasInstance, value: type } = useInstanceOption('type', true)
  if (!hasInstance) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP)
  }
  if (!type) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
  }

  // Check if it's a Custom Element
  const { value: isCE } = useInstanceOption('ce', true)

  // Get I18n instance via inject
  const i18n = inject(I18nInjectionKey)
  if (!i18n) {
    throw createI18nError(
      isCE ? I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE : I18nErrorCodes.NOT_INSTALLED
    )
  }

  const gl = i18n.global
  const scope = getScope(options, type)

  // Global scope
  if (scope === 'global') {
    adjustI18nResources(gl, options, type)
    return gl as unknown as Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  }

  // Parent scope via `inject`
  if (scope === 'parent') {
    const parentComposer = inject(I18nComposerKey, null)
    if (parentComposer == null) {
      if (__DEV__) {
        warn(getWarnMessage(I18nWarnCodes.NOT_FOUND_PARENT_SCOPE))
      }
      return gl as unknown as Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
    }
    return parentComposer as unknown as Composer<
      Messages,
      DateTimeFormats,
      NumberFormats,
      OptionLocale
    >
  }

  // Local scope
  const i18nInternal = i18n as unknown as I18nInternal

  // Duplicate call detection via uid
  const { value: uid } = useInstanceOption('uid', true)
  if (!isNumber(uid)) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
  }
  const existingEntry = i18nInternal.__getInstance(uid)
  if (existingEntry != null) {
    if (__DEV__) {
      throw createI18nError(I18nErrorCodes.DUPLICATE_USE_I18N_CALLING)
    }
    return existingEntry.composer as unknown as Composer<
      Messages,
      DateTimeFormats,
      NumberFormats,
      OptionLocale
    >
  }

  // Create Composer
  const composerOptions = assign({}, options) as ComposerOptions & ComposerInternalOptions

  // SFC i18n custom blocks
  if ('__i18n' in type) {
    composerOptions.__i18n = type.__i18n as CustomBlocks
  }

  // Set parent Composer as fallback root
  const parentComposer = inject(I18nComposerKey, null)
  composerOptions.__root = parentComposer || gl

  const composer = createComposer(composerOptions) as Composer

  // ComposerExtend
  if (i18nInternal.__composerExtend) {
    ;(composer as any)[DisposeSymbol] = i18nInternal.__composerExtend(composer)
  }

  // Register instance
  const label = type.name || type.__name || type.__file || 'Anonymous'
  i18nInternal.__setInstance(uid, { composer, label })

  // Lifecycle management via onScopeDispose
  const currentScope = getCurrentScope()
  if (currentScope) {
    onScopeDispose(() => {
      i18nInternal.__deleteInstance(uid)
      const dispose = (composer as any)[DisposeSymbol]
      if (dispose) {
        dispose()
        delete (composer as any)[DisposeSymbol]
      }
    })
  }

  // Provide to child components
  provide(I18nComposerKey, composer)

  return composer as unknown as Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
}

function createGlobal(options: I18nOptions): [EffectScope, Composer] {
  const scope = effectScope()
  const obj = scope.run(() => createComposer(options))
  if (obj == null) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
  }
  return [scope, obj]
}

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

/**
 * Exported global composer instance
 *
 * @remarks
 * This interface is the {@link I18n#global | global composer} that is provided interface that is injected into each component with `app.config.globalProperties`.
 *
 * @VueI18nGeneral
 */
export interface ExportedGlobalComposer {
  /**
   * Locale
   *
   * @remarks
   * This property is proxy-like property for `Composer#locale`. About details, see the {@link Composer#locale}
   */
  locale: Locale
  /**
   * Fallback locale
   *
   * @remarks
   * This property is proxy-like property for `Composer#fallbackLocale`. About details, see the {@link Composer#fallbackLocale}
   */
  fallbackLocale: FallbackLocale
  /**
   * Available locales
   *
   * @remarks
   * This property is proxy-like property for `Composer#availableLocales`. About details, see the {@link Composer#availableLocales}
   */
  readonly availableLocales: Locale[]
}

const globalExportProps = ['locale', 'fallbackLocale', 'availableLocales'] as const
const globalExportMethods = !__LITE__ ? ['t', 'rt', 'd', 'n', 'tm', 'te'] : ['t']

function injectGlobalFields(app: App, composer: Composer): Disposer {
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

  const dispose = () => {
    delete (app as any).config.globalProperties.$i18n
    globalExportMethods.forEach(method => {
      delete (app as any).config.globalProperties[`$${method}`]
    })
  }

  return dispose
}

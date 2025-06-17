import {
  assign,
  createEmitter,
  isBoolean,
  isEmptyObject,
  isPlainObject,
  makeSymbol,
  warn
} from '@intlify/shared'
import {
  effectScope,
  getCurrentInstance,
  inject,
  isRef,
  onMounted,
  onUnmounted
} from 'vue'
import { createComposer } from './composer'
import { addTimelineEvent, enableDevTools } from './devtools'
import { I18nErrorCodes, createI18nError } from './errors'
import { apply as applyPlugin } from './plugin/next'
import { DisableEmitter, DisposeSymbol, EnableEmitter } from './symbols'
import { adjustI18nResources, getComponentOptions } from './utils'
import { I18nWarnCodes, getWarnMessage } from './warnings'

import type {
  FallbackLocale,
  Locale,
  LocaleParams,
  SchemaParams
} from '@intlify/core-base'
import type {
  VueDevToolsEmitter,
  VueDevToolsEmitterEvents
} from '@intlify/devtools-types'
import type {
  App,
  ComponentInternalInstance,
  EffectScope,
  InjectionKey
} from 'vue'
import type {
  Composer,
  ComposerInternalOptions,
  ComposerOptions,
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
   * @VueI18nSee [Implicit with injected properties and functions](../../guide/advanced/composition#implicit-with-injected-properties-and-functions)
   * @VueI18nSee [ComponentCustomProperties](injection#componentcustomproperties)
   *
   * @defaultValue `true`
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
    Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  >
  __getInstance<
    Instance extends Composer<
      Messages,
      DateTimeFormats,
      NumberFormats,
      OptionLocale
    >
  >(
    component: ComponentInternalInstance
  ): Instance | null
  __setInstance<
    Instance extends Composer<
      Messages,
      DateTimeFormats,
      NumberFormats,
      OptionLocale
    >
  >(
    component: ComponentInternalInstance,
    instance: Instance
  ): void
  __deleteInstance(component: ComponentInternalInstance): void
  __composerExtend?: ComposerExtender
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
  options: Options
): I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>

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
 * @VueI18nSee [Getting Started](../../guide/essentials/started)
 * @VueI18nSee [Composition API](../../guide/advanced/composition)
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
  options: Options
): I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createI18n(options: any = {}): any {
  type _I18n = I18n & I18nInternal

  // prettier-ignore
  const __globalInjection = isBoolean(options.globalInjection)
    ? options.globalInjection
    : true
  const __instances = new Map<ComponentInternalInstance, Composer>()
  const [globalScope, __global] = createGlobal(options)
  const symbol: InjectionKey<I18n> | string = /* #__PURE__*/ makeSymbol(
    __DEV__ ? 'vue-i18n' : ''
  )

  function __getInstance(
    component: ComponentInternalInstance
  ): Composer | null {
    return __instances.get(component) || null
  }
  function __setInstance(
    component: ComponentInternalInstance,
    instance: Composer
  ): void {
    __instances.set(component, instance)
  }
  function __deleteInstance(component: ComponentInternalInstance): void {
    __instances.delete(component)
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

      // set composer extend hook options from plugin options
      if (isPlainObject(options[0])) {
        const opts = options[0] as ExtendHooks
        // Plugin options cannot be passed directly to the function that creates Composer
        // so we keep it temporary
        ;(i18n as unknown as I18nInternal).__composerExtend =
          opts.__composerExtend
      }

      // global method and properties injection for Composition API
      let globalReleaseHandler: ReturnType<typeof injectGlobalFields> | null =
        null
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
        globalReleaseHandler && globalReleaseHandler()
        i18n.dispose()
        unmountApp()
      }

      // setup vue-devtools plugin
      if ((__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) && !__NODE_JS__) {
        const ret = await enableDevTools(app, i18n as _I18n)
        if (!ret) {
          throw createI18nError(I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN)
        }
        const emitter: VueDevToolsEmitter =
          createEmitter<VueDevToolsEmitterEvents>()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const _composer = __global as any
        _composer[EnableEmitter] && _composer[EnableEmitter](emitter)
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
    !instance.isCE &&
    instance.appContext.app != null &&
    !instance.appContext.app.__VUE_I18N_SYMBOL__
  ) {
    throw createI18nError(I18nErrorCodes.NOT_INSTALLED)
  }

  const i18n = getI18nInstance(instance)
  const gl = getGlobalComposer(i18n)
  const componentOptions = getComponentOptions(instance)
  const scope = getScope(options, componentOptions)

  if (scope === 'global') {
    adjustI18nResources(gl, options, componentOptions)
    return gl as unknown as Composer<
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
      composer = gl as unknown as Composer
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

    if (gl) {
      composerOptions.__root = gl
    }

    composer = createComposer(composerOptions) as Composer
    if (i18nInternal.__composerExtend) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(composer as any)[DisposeSymbol] =
        i18nInternal.__composerExtend(composer)
    }
    setupLifeCycle(i18nInternal, instance, composer)

    i18nInternal.__setInstance(instance, composer)
  } else {
    if (__DEV__ && scope === 'local') {
      throw createI18nError(I18nErrorCodes.DUPLICATE_USE_I18N_CALLING)
    }
  }

  return composer as unknown as Composer<
    Messages,
    DateTimeFormats,
    NumberFormats,
    OptionLocale
  >
}

function createGlobal(options: I18nOptions): [EffectScope, Composer] {
  const scope = effectScope()
  const obj = scope.run(() => createComposer(options))
  if (obj == null) {
    throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
  }
  return [scope, obj]
}

function getI18nInstance(instance: ComponentInternalInstance): I18n {
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
        : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE
    )
  }
  return i18n
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
  return i18n.global
}

function getComposer(
  i18n: I18n,
  target: ComponentInternalInstance,
  useComponent = false
): Composer | null {
  let composer: Composer | null = null
  const root = target.root
  let current: ComponentInternalInstance | null = getParentComponentInstance(
    target,
    useComponent
  )
  while (current != null) {
    const i18nInternal = i18n as unknown as I18nInternal
    composer = i18nInternal.__getInstance(current)

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

function getParentComponentInstance(
  target: ComponentInternalInstance | null,
  useComponent = false
) {
  if (target == null) {
    return null
  }
  // if `useComponent: true` will be specified, we get lexical scope owner instance for use-case slots
  return !useComponent
    ? target.parent
    : (target.vnode as any).ctx || target.parent // eslint-disable-line @typescript-eslint/no-explicit-any
}

function setupLifeCycle(
  i18n: I18nInternal,
  target: ComponentInternalInstance,
  composer: Composer
): void {
  let emitter: VueDevToolsEmitter | null = null

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _composer = composer as any

    // remove composer instance from DOM for intlify-devtools
    if (
      (__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) &&
      !__NODE_JS__ &&
      target.vnode.el &&
      target.vnode.el.__VUE_I18N__
    ) {
      emitter && emitter.off('*', addTimelineEvent)
      _composer[DisableEmitter] && _composer[DisableEmitter]()
      delete target.vnode.el.__VUE_I18N__
    }
    i18n.__deleteInstance(target)

    // dispose extended resources
    const dispose = _composer[DisposeSymbol]
    if (dispose) {
      dispose()
      delete _composer[DisposeSymbol]
    }
  }, target)
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

  const dispose = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (app as any).config.globalProperties.$i18n
    globalExportMethods.forEach(method => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (app as any).config.globalProperties[`$${method}`]
    })
  }

  return dispose
}

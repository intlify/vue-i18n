import {
  compile,
  fallbackWithLocaleChain,
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue,
  setDevToolsHook
} from '@intlify/core-base'
import { getGlobalThis } from '@intlify/shared'
import { initDev, initFeatureFlags } from '@intlify/vue-i18n-core'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

// register message compiler for jit compilation
registerMessageCompiler(compile)

// register message resolver at vue-i18n
registerMessageResolver(resolveValue)

// register fallback locale at vue-i18n
registerLocaleFallbacker(fallbackWithLocaleChain)

export type {
  CompileError,
  DateTimeOptions,
  FallbackLocale,
  DateTimeFormat as IntlDateTimeFormat,
  DateTimeFormats as IntlDateTimeFormats,
  FormatMatcher as IntlFormatMatcher,
  LocaleMatcher as IntlLocaleMatcher,
  NumberFormat as IntlNumberFormat,
  NumberFormats as IntlNumberFormats,
  LinkedModifiers,
  Locale,
  LocaleMessageDictionary,
  LocaleMessages,
  LocaleMessageType,
  LocaleMessageValue,
  MessageCompiler,
  MessageCompilerContext,
  MessageContext,
  MessageFunction,
  MessageFunctions,
  MessageResolver,
  NamedValue,
  NumberOptions,
  Path,
  PathValue,
  PluralizationRule,
  PostTranslationHandler,
  RemovedIndexResources,
  TranslateOptions
} from '@intlify/core-base'
export {
  createI18n,
  I18nInjectionKey,
  useI18n,
  VERSION
} from '@intlify/vue-i18n-core'
export type {
  BaseFormatProps,
  ComponentI18nScope,
  Composer,
  ComposerAdditionalOptions,
  ComposerCustom,
  ComposerDateTimeFormatting,
  ComposerExtender,
  ComposerNumberFormatting,
  ComposerOptions,
  ComposerResolveLocaleMessageTranslation,
  ComposerTranslation,
  CustomBlock,
  CustomBlocks,
  DatetimeFormat,
  DatetimeFormatProps,
  DefaultDateTimeFormatSchema,
  DefaultLocaleMessageSchema,
  DefaultNumberFormatSchema,
  DefineDateTimeFormat,
  DefineLocaleMessage,
  DefineNumberFormat,
  Disposer,
  ExportedGlobalComposer,
  FormattableProps,
  I18n,
  I18nAdditionalOptions,
  I18nD,
  I18nN,
  I18nOptions,
  I18nPluginOptions,
  I18nScope,
  I18nT,
  MissingHandler,
  NumberFormat,
  NumberFormatProps,
  Translation,
  TranslationProps,
  UseI18nOptions,
  VueMessageType
} from '@intlify/vue-i18n-core'

export type {
  IsEmptyObject,
  IsNever,
  PickupFormatPathKeys,
  PickupKeys,
  PickupPaths
} from '@intlify/core-base'

// NOTE: experimental !!
if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
  const target = getGlobalThis()
  target.__INTLIFY__ = true
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)
}

if (__DEV__) {
  initDev()
}

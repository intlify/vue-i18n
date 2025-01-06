import {
  compile,
  registerMessageCompiler,
  setDevToolsHook
} from '@intlify/core-base'
import { getGlobalThis } from '@intlify/shared'
import { initDev, initFeatureFlags } from '@intlify/vue-i18n-core/petite'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

// register message compiler for jit compilation
registerMessageCompiler(compile)

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
  registerLocaleFallbacker,
  registerMessageResolver,
  RemovedIndexResources,
  TranslateOptions
} from '@intlify/core-base'
export { createI18n, useI18n, VERSION } from '@intlify/vue-i18n-core/petite'
export type {
  Choice,
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
  DateTimeFormatResult,
  DefaultDateTimeFormatSchema,
  DefaultLocaleMessageSchema,
  DefaultNumberFormatSchema,
  DefineDateTimeFormat,
  DefineLocaleMessage,
  DefineNumberFormat,
  Disposer,
  ExportedGlobalComposer,
  I18n,
  I18nAdditionalOptions,
  I18nMode,
  I18nOptions,
  I18nPluginOptions,
  I18nScope,
  LocaleMessageObject,
  MissingHandler,
  NumberFormatResult,
  PluralizationRulesMap,
  TranslateResult,
  UseI18nOptions,
  VueI18n,
  VueI18nDateTimeFormatting,
  VueI18nExtender,
  VueI18nNumberFormatting,
  VueI18nOptions,
  VueI18nResolveLocaleMessageTranslation,
  VueI18nTranslation,
  VueMessageType,
  WarnHtmlInMessageLevel
} from '@intlify/vue-i18n-core/petite'

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

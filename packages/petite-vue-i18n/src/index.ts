import { compile, registerMessageCompiler } from '@intlify/core-base'
import { initDev, initFeatureFlags } from '@intlify/vue-i18n-core/petite'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

// register message compiler at petite-vue-i18n
registerMessageCompiler(compile)

export type {
  CompileError,
  DateTimeOptions,
  FallbackLocale,
  GeneratedTypeConfig,
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
  I18nOptions,
  I18nPluginOptions,
  I18nScope,
  MissingHandler,
  UseI18nOptions,
  VueMessageType
} from '@intlify/vue-i18n-core/petite'

export type {
  IsEmptyObject,
  IsNever,
  JsonPaths,
  PickupFormatPathKeys,
  PickupKeys,
  PickupPaths
} from '@intlify/core-base'

if (__DEV__) {
  initDev()
}

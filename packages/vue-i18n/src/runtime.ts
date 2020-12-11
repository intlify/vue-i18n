import { initDev, initFeatureFlags } from './misc'

export { Path, PathValue } from '@intlify/message-resolver'
export {
  MessageFunction,
  MessageFunctions,
  PluralizationRule,
  LinkedModifiers
} from '@intlify/runtime'
export {
  TranslateOptions,
  DateTimeOptions,
  NumberOptions,
  PostTranslationHandler
} from '@intlify/core/src/runtime'
export {
  VueMessageType,
  MissingHandler,
  ComposerOptions,
  Composer,
  CustomBlocks
} from './composer'
export {
  TranslateResult,
  Choice,
  LocaleMessageObject,
  PluralizationRulesMap,
  WarnHtmlInMessageLevel,
  DateTimeFormatResult,
  NumberFormatResult,
  Formatter,
  VueI18nOptions,
  VueI18n
} from './legacy'
export {
  createI18n,
  useI18n,
  I18nOptions,
  I18nAdditionalOptions,
  I18n,
  I18nMode,
  I18nScope,
  ComposerAdditionalOptions,
  UseI18nOptions,
  ExportedGlobalComposer
} from './i18n'
export {
  Translation,
  TranslationProps,
  NumberFormat,
  NumberFormatProps,
  DatetimeFormat,
  DatetimeFormatProps,
  FormattableProps,
  BaseFormatProps,
  ComponetI18nScope
} from './components'
export { vTDirective, TranslationDirective } from './directive'
export { I18nPluginOptions } from './plugin'
export { VERSION } from './misc'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

__DEV__ && initDev()

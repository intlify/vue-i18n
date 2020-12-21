import { initDev, initFeatureFlags } from './misc'
import { registerMessageCompiler, compileToFunction } from '@intlify/core'

// register message compiler at vue-i18n
registerMessageCompiler(compileToFunction)

export {
  Path,
  PathValue,
  MessageFunction,
  MessageFunctions,
  PluralizationRule,
  LinkedModifiers,
  TranslateOptions,
  DateTimeOptions,
  NumberOptions,
  PostTranslationHandler
} from '@intlify/core-base'
export {
  VueMessageType,
  MissingHandler,
  ComposerOptions,
  Composer,
  CustomBlock,
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

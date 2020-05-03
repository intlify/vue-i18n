import { App, FunctionDirective } from 'vue'
import { Composer } from './composer'
import { GlobalI18nSymbol } from './i18n'
import { Translation, NumberFormat, DatetimeFormat } from './components'
import { hook as vT } from './directive'
import { isPlainObject, isString, warn } from './utils'

export type I18nPluginOptions = {
  'i18n-t'?: string
}

export function apply(
  app: App,
  composer: Composer,
  ...options: unknown[]
): void {
  const pluginOptions = parseOptions(...options)

  if (__DEV__ && isString(pluginOptions['i18n-t'])) {
    warn(
      `Rename the component name: '${Translation.name}' -> '${pluginOptions['i18n-t']}'`
    )
  }

  // install components
  app.component(pluginOptions['i18n-t'] || Translation.name, Translation)
  app.component(NumberFormat.name, NumberFormat)
  app.component(DatetimeFormat.name, DatetimeFormat)

  // install directive
  app.directive('t', vT as FunctionDirective) // TODO:

  // setup global provider
  app.provide(GlobalI18nSymbol, composer)
}

function parseOptions(...options: unknown[]): I18nPluginOptions {
  const [arg] = options
  const ret = {} as I18nPluginOptions

  if (!isPlainObject(arg)) {
    return ret
  }
  if (!isString((arg as I18nPluginOptions)['i18n-t'])) {
    return ret
  }

  ret['i18n-t'] = (arg as I18nPluginOptions)['i18n-t']
  return ret
}

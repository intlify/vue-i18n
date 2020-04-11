import { App, FunctionDirective } from 'vue'
import { Composer } from './composer'
import { GlobalI18nSymbol } from './i18n'
import { Translation, NumberFormat } from './components'
import { hook as vT } from './directive'
import { isPlainObject, isString, warn } from './utils'

export type I18nPluginOptions = {
  'i18n-t'?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apply(app: App, composer: Composer, ...options: any[]): void {
  const pluginOptions = parseOptions(...options)

  if (__DEV__ && isString(pluginOptions['i18n-t'])) {
    warn(
      `Rename the component name: '${Translation.name}' -> '${pluginOptions['i18n-t']}'`
    )
  }

  // install components
  app.component(pluginOptions['i18n-t'] || Translation.name, Translation)
  app.component(NumberFormat.name, NumberFormat)

  // install directive
  app.directive('t', vT as FunctionDirective) // TODO:

  // setup global provider
  app.provide(GlobalI18nSymbol, composer)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseOptions(...options: any[]): I18nPluginOptions {
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

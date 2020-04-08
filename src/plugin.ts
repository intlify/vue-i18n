import { App, FunctionDirective } from 'vue'
import { Composer } from './composer'
import { GlobalI18nSymbol } from './i18n'
import { Interpolate, Number } from './components'
import { hook as vT } from './directive'

export function apply(app: App, composer: Composer): void {
  // install components
  app.component(Interpolate.name, Interpolate)
  app.component(Number.name, Number)

  // install directive
  app.directive('t', vT as FunctionDirective) // TODO:

  // setup global provider
  app.provide(GlobalI18nSymbol, composer)
}

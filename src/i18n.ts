import { App, InjectionKey } from 'vue'
import { MessageContextOptions, MessageContext, createMessageContext } from './context'

export type I18nOptions = MessageContextOptions
export type VueI18n = MessageContext & {
  install: (app: App) => void
}

export const VueI18nSymbol: InjectionKey<MessageContext> = Symbol.for('vue-i18n')

export function createI18n (options: I18nOptions = {}): VueI18n {
  const i18n = createMessageContext(options) as VueI18n
  i18n.install = (app: App): void => {
    applyPlugin(app, i18n)
  }
  return i18n
}

function applyPlugin (app: App, context: MessageContext): void {
  // TODO: merge strats?
  app.provide(VueI18nSymbol, context)
}

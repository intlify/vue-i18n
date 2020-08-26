import { I18n } from './i18n'

interface I18nRecord {
  id: number
  version: string
}

const enum DevtoolsHooks {
  REGISTER = 'intlify:register'
}

interface DevtoolsHook {
  emit(event: string, ...payload: unknown[]): void
  on(event: string, handler: Function): void
  off(event: string, handler: Function): void
  i18nRecords: I18nRecord[]
}

export let devtools: DevtoolsHook

export function setDevtoolsHook(hook: DevtoolsHook): void {
  devtools = hook
}

export function devtoolsRegisterI18n(i18n: I18n, version: string): void {
  if (!devtools) {
    return
  }
  devtools.emit(DevtoolsHooks.REGISTER, i18n, version)
}

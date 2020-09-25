import { App } from 'vue'
import { setupDevtoolsPlugin, DevtoolsPluginApi } from '@vue/devtools-api'
import { I18n } from '../i18n'
import { Composer } from '../composer'

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

let devtoolsApi: DevtoolsPluginApi

export async function enableDevTools(app: App, i18n: I18n): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      setupDevtoolsPlugin(
        {
          id: 'vue-devtools-plugin-vue-i18n',
          label: 'Vue I18n devtools',
          app
        },
        api => {
          devtoolsApi = api

          api.on.inspectComponent((payload, ctx) => {
            console.log('inspectComponent', payload, ctx)
            const componentInstance = payload.componentInstance
            if (
              componentInstance.vnode.el.__INTLIFY__ &&
              payload.instanceData
            ) {
              const composer = componentInstance.vnode.el.__INTLIFY__ as Composer
              payload.instanceData.state.push({
                type: 'vue-i18n: locale',
                key: 'locale',
                editable: false,
                value: composer.locale.value
              })
              payload.instanceData.state.push({
                type: 'vue-i18n: fallbackLocale',
                key: 'fallbackLocale',
                editable: false,
                value: composer.fallbackLocale.value
              })
              payload.instanceData.state.push({
                type: 'vue-i18n: messages',
                key: 'messages',
                editable: false,
                value: composer.messages.value
              })
              /*
              payload.instanceData.state.push({
                type: stateType,
                key: 'time',
                value: {
                  _custom: {
                    type: null,
                    readOnly: true,
                    display: `${time}s`,
                    tooltip: 'Elapsed time',
                    value: time
                  }
                }
              })
              */
            }
          })

          resolve(true)
        }
      )
    } catch (e) {
      console.error(e)
      reject(false)
    }
  })
}

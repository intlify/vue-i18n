import { isMessageAST } from '@intlify/core-base'
import { isArray, isBoolean, isFunction, isObject, isString } from '@intlify/shared'
import { setupDevtoolsPlugin } from '@vue/devtools-api'

import type {
  VueDevToolsIDs,
  VueDevToolsTimelineEventPayloads,
  VueDevToolsTimelineEvents
} from '@intlify/devtools-types'
import type {
  ComponentStateBase,
  ComponentTreeNode,
  CustomInspectorState,
  DevtoolsPluginApi,
  HookPayloads,
  Hooks,
  InspectedComponentData
} from '@vue/devtools-api'
import type { App } from 'vue'
import type { Composer } from './composer'
import type { I18n, I18nInternal } from './i18n'

type _I18n = I18n & I18nInternal

const VUE_I18N_COMPONENT_TYPES = 'vue-i18n: composer properties'

const VueDevToolsLabels: Record<VueDevToolsIDs, string> = {
  'vue-devtools-plugin-vue-i18n': 'Vue I18n DevTools',
  'vue-i18n-resource-inspector': 'Vue I18n DevTools',
  'vue-i18n-timeline': 'Vue I18n'
}

const VueDevToolsPlaceholders: Record<'vue-i18n-resource-inspector', string> = {
  'vue-i18n-resource-inspector': 'Search for scopes ...'
}

const VueDevToolsTimelineColors: Record<'vue-i18n-timeline', number> = {
  'vue-i18n-timeline': 0xffcd19
}

let devtoolsApi: DevtoolsPluginApi<{}>

export async function enableDevTools(app: App, i18n: _I18n): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      setupDevtoolsPlugin(
        {
          id: 'vue-devtools-plugin-vue-i18n',
          label: VueDevToolsLabels['vue-devtools-plugin-vue-i18n'],
          packageName: 'vue-i18n',
          homepage: 'https://vue-i18n.intlify.dev',
          logo: 'https://vue-i18n.intlify.dev/vue-i18n-devtools-logo.png',
          componentStateTypes: [VUE_I18N_COMPONENT_TYPES],
          app: app as any
        },
        api => {
          devtoolsApi = api

          api.on.visitComponentTree(({ componentInstance, treeNode }) => {
            updateComponentTreeTags(componentInstance, treeNode, i18n)
          })

          api.on.inspectComponent(({ componentInstance, instanceData }) => {
            if (componentInstance && componentInstance.uid != null && instanceData) {
              const entry = i18n.__instances.get(componentInstance.uid)
              if (entry) {
                inspectComposer(instanceData, entry.composer)
              }
            }
          })

          api.addInspector({
            id: 'vue-i18n-resource-inspector',
            label: VueDevToolsLabels['vue-i18n-resource-inspector'],
            icon: 'language',
            treeFilterPlaceholder: VueDevToolsPlaceholders['vue-i18n-resource-inspector']
          })

          api.on.getInspectorTree(payload => {
            if (payload.app === app && payload.inspectorId === 'vue-i18n-resource-inspector') {
              registerScope(payload, i18n)
            }
          })

          const roots = new Map<App, any>()
          api.on.getInspectorState(async payload => {
            if (payload.app === app && payload.inspectorId === 'vue-i18n-resource-inspector') {
              api.unhighlightElement()

              inspectScope(payload, i18n)

              if (payload.nodeId === 'global') {
                if (!roots.has(payload.app)) {
                  const [root] = await api.getComponentInstances(payload.app)
                  roots.set(payload.app, root)
                }
                api.highlightElement(roots.get(payload.app))
              } else {
                const uid = parseInt(payload.nodeId, 10)
                const instance = await findComponentByUid(api, payload.app, uid)
                instance && api.highlightElement(instance)
              }
            }
          })

          api.on.editInspectorState(payload => {
            if (payload.app === app && payload.inspectorId === 'vue-i18n-resource-inspector') {
              editScope(payload, i18n)
            }
          })

          api.addTimelineLayer({
            id: 'vue-i18n-timeline',
            label: VueDevToolsLabels['vue-i18n-timeline'],
            color: VueDevToolsTimelineColors['vue-i18n-timeline']
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

function updateComponentTreeTags(instance: any, treeNode: ComponentTreeNode, i18n: _I18n): void {
  if (!instance || instance.uid == null) return

  const entry = i18n.__instances.get(instance.uid)
  if (entry && entry.composer !== i18n.global) {
    const tag = {
      label: `i18n (${entry.label} Scope)`,
      textColor: 0x000000,
      backgroundColor: 0xffcd19
    }
    treeNode.tags.push(tag)
  }
}

function inspectComposer(instanceData: InspectedComponentData, composer: Composer): void {
  const type = VUE_I18N_COMPONENT_TYPES
  instanceData.state.push({
    type,
    key: 'locale',
    editable: true,
    value: composer.locale.value
  })
  instanceData.state.push({
    type,
    key: 'availableLocales',
    editable: false,
    value: composer.availableLocales
  })
  instanceData.state.push({
    type,
    key: 'fallbackLocale',
    editable: true,
    value: composer.fallbackLocale.value
  })
  instanceData.state.push({
    type,
    key: 'inheritLocale',
    editable: true,
    value: composer.inheritLocale
  })
  instanceData.state.push({
    type,
    key: 'messages',
    editable: false,
    value: getLocaleMessageValue(composer.messages.value)
  })
  if (!__LITE__) {
    instanceData.state.push({
      type,
      key: 'datetimeFormats',
      editable: false,
      value: composer.datetimeFormats.value
    })
    instanceData.state.push({
      type,
      key: 'numberFormats',
      editable: false,
      value: composer.numberFormats.value
    })
  }
}

function getLocaleMessageValue(messages: any): Record<string, unknown> {
  const value: Record<string, unknown> = {}
  Object.keys(messages).forEach((key: string) => {
    const v: unknown = messages[key]
    if (isFunction(v) && 'source' in v) {
      value[key] = getMessageFunctionDetails(v)
    } else if (isMessageAST(v) && v.loc && v.loc.source) {
      value[key] = v.loc.source
    } else if (isObject(v)) {
      value[key] = getLocaleMessageValue(v)
    } else {
      value[key] = v
    }
  })
  return value
}

const ESC: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '&': '&amp;'
}

function escape(s: string): string {
  return s.replace(/[<>"&]/g, escapeChar)
}

function escapeChar(a: string): string {
  return ESC[a] || a
}

function getMessageFunctionDetails(func: any): Record<string, unknown> {
  const argString = func.source ? `("${escape(func.source)}")` : `(?)`
  return {
    _custom: {
      type: 'function',
      display: `<span>ƒ</span> ${argString}`
    }
  }
}

function registerScope(payload: HookPayloads[Hooks.GET_INSPECTOR_TREE], i18n: _I18n): void {
  payload.rootNodes.push({
    id: 'global',
    label: 'Global Scope'
  })
  const global = i18n.global
  for (const [uid, entry] of i18n.__instances) {
    if (global === entry.composer) {
      continue
    }
    payload.rootNodes.push({
      id: uid.toString(),
      label: `${entry.label} Scope`
    })
  }
}

async function findComponentByUid(
  api: DevtoolsPluginApi<{}>,
  app: App,
  targetUid: number
): Promise<any> {
  const instances = await api.getComponentInstances(app)
  return searchByUid(instances, targetUid)
}

function searchByUid(instances: any[], targetUid: number): any {
  for (const instance of instances) {
    if (instance.uid === targetUid) {
      return instance
    }
    // Search in children if available
    if (instance.subTree?.children) {
      const found = searchByUid(instance.subTree.children, targetUid)
      if (found) {
        return found
      }
    }
  }
  return null
}

function getComposer(nodeId: string, i18n: _I18n): Composer | null {
  if (nodeId === 'global') {
    return i18n.global
  }
  const uid = parseInt(nodeId, 10)
  const entry = i18n.__instances.get(uid)
  return entry?.composer || null
}

function inspectScope(payload: HookPayloads[Hooks.GET_INSPECTOR_STATE], i18n: _I18n): any {
  const composer = getComposer(payload.nodeId, i18n)
  if (composer) {
    // TODO:

    payload.state = makeScopeInspectState(composer as any)
  }
  return null
}

function makeScopeInspectState(composer: Composer): CustomInspectorState {
  const state: CustomInspectorState = {}

  const localeType = 'Locale related info'
  const localeStates: ComponentStateBase[] = [
    {
      type: localeType,
      key: 'locale',
      editable: true,
      value: composer.locale.value
    },
    {
      type: localeType,
      key: 'fallbackLocale',
      editable: true,
      value: composer.fallbackLocale.value
    },
    {
      type: localeType,
      key: 'availableLocales',
      editable: false,
      value: composer.availableLocales
    },
    {
      type: localeType,
      key: 'inheritLocale',
      editable: true,
      value: composer.inheritLocale
    }
  ]
  state[localeType] = localeStates

  const localeMessagesType = 'Locale messages info'
  const localeMessagesStates: ComponentStateBase[] = [
    {
      type: localeMessagesType,
      key: 'messages',
      editable: false,
      value: getLocaleMessageValue(composer.messages.value)
    }
  ]
  state[localeMessagesType] = localeMessagesStates

  if (!__LITE__) {
    const datetimeFormatsType = 'Datetime formats info'
    const datetimeFormatsStates: ComponentStateBase[] = [
      {
        type: datetimeFormatsType,
        key: 'datetimeFormats',
        editable: false,
        value: composer.datetimeFormats.value
      }
    ]
    state[datetimeFormatsType] = datetimeFormatsStates

    const numberFormatsType = 'Datetime formats info'
    const numberFormatsStates: ComponentStateBase[] = [
      {
        type: numberFormatsType,
        key: 'numberFormats',
        editable: false,
        value: composer.numberFormats.value
      }
    ]
    state[numberFormatsType] = numberFormatsStates
  }

  return state
}

export function addTimelineEvent(
  event: VueDevToolsTimelineEvents,
  payload?: VueDevToolsTimelineEventPayloads[VueDevToolsTimelineEvents]
): void {
  if (devtoolsApi) {
    let groupId: string | undefined
    if (payload && 'groupId' in payload) {
      groupId = payload.groupId
      delete payload.groupId
    }
    devtoolsApi.addTimelineEvent({
      layerId: 'vue-i18n-timeline',
      event: {
        title: event,
        groupId,
        time: Date.now(),
        meta: {},
        data: payload || {},
        logType:
          event === 'compile-error'
            ? 'error'
            : event === 'fallback' || event === 'missing'
              ? 'warning'
              : 'default'
      }
    })
  }
}

function editScope(payload: HookPayloads[Hooks.EDIT_INSPECTOR_STATE], i18n: _I18n): void {
  const composer = getComposer(payload.nodeId, i18n)
  if (composer) {
    const [field] = payload.path
    if (field === 'locale' && isString(payload.state.value)) {
      composer.locale.value = payload.state.value
    } else if (
      field === 'fallbackLocale' &&
      (isString(payload.state.value) ||
        isArray(payload.state.value) ||
        isObject(payload.state.value))
    ) {
      composer.fallbackLocale.value = payload.state.value
    } else if (field === 'inheritLocale' && isBoolean(payload.state.value)) {
      composer.inheritLocale = payload.state.value
    }
  }
}

import {
  setupDevtoolsPlugin,
  Hooks,
  ComponentTreeNode
} from '@vue/devtools-api'
import {
  VueDevToolsIDs,
  VueDevToolsTimelineColors,
  VueDevToolsLabels,
  VueDevToolsPlaceholders,
  VueDevToolsTimelineEvents
} from '@intlify/vue-devtools'
import {
  isFunction,
  isString,
  isBoolean,
  isObject,
  isArray
} from '@intlify/shared'

import type { App, ComponentInternalInstance } from 'vue'
import type {
  DevtoolsPluginApi,
  InspectedComponentData,
  CustomInspectorState,
  ComponentStateBase,
  HookPayloads
} from '@vue/devtools-api'
import type { VueDevToolsTimelineEventPayloads } from '@intlify/vue-devtools'
import type { I18n, I18nInternal } from './i18n'
import type { Composer } from './composer'
import type { VueI18nInternal } from './legacy'

type _I18n = I18n & I18nInternal

const VUE_I18N_COMPONENT_TYPES = 'vue-i18n: composer properties'

let devtoolsApi: DevtoolsPluginApi

export async function enableDevTools(app: App, i18n: _I18n): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      setupDevtoolsPlugin(
        {
          id: VueDevToolsIDs.PLUGIN,
          label: VueDevToolsLabels[VueDevToolsIDs.PLUGIN],
          packageName: 'vue-i18n',
          homepage: 'https://vue-i18n.intlify.dev',
          logo: 'https://vue-i18n.intlify.dev/vue-i18n-devtools-logo.png',
          componentStateTypes: [VUE_I18N_COMPONENT_TYPES],
          app
        },
        api => {
          devtoolsApi = api

          api.on.visitComponentTree(({ componentInstance, treeNode }) => {
            updateComponentTreeTags(componentInstance, treeNode, i18n)
          })

          api.on.inspectComponent(({ componentInstance, instanceData }) => {
            if (componentInstance.vnode.el.__VUE_I18N__ && instanceData) {
              if (i18n.mode === 'legacy') {
                // ignore global scope on legacy mode
                if (
                  componentInstance.vnode.el.__VUE_I18N__ !==
                  ((i18n.global as unknown) as VueI18nInternal).__composer
                ) {
                  inspectComposer(
                    instanceData,
                    componentInstance.vnode.el.__VUE_I18N__ as Composer
                  )
                }
              } else {
                inspectComposer(
                  instanceData,
                  componentInstance.vnode.el.__VUE_I18N__ as Composer
                )
              }
            }
          })

          api.addInspector({
            id: VueDevToolsIDs.CUSTOM_INSPECTOR,
            label: VueDevToolsLabels[VueDevToolsIDs.CUSTOM_INSPECTOR],
            icon: 'language',
            treeFilterPlaceholder:
              VueDevToolsPlaceholders[VueDevToolsIDs.CUSTOM_INSPECTOR]
          })

          api.on.getInspectorTree(payload => {
            if (
              payload.app === app &&
              payload.inspectorId === VueDevToolsIDs.CUSTOM_INSPECTOR
            ) {
              registerScope(payload, i18n)
            }
          })

          const roots = new Map<App, ComponentInternalInstance>()
          api.on.getInspectorState(async payload => {
            if (
              payload.app === app &&
              payload.inspectorId === VueDevToolsIDs.CUSTOM_INSPECTOR
            ) {
              api.unhighlightElement()

              inspectScope(payload, i18n)

              if (payload.nodeId === 'global') {
                if (!roots.has(payload.app)) {
                  const [root] = await api.getComponentInstances(payload.app)
                  roots.set(payload.app, root)
                }
                api.highlightElement(roots.get(payload.app))
              } else {
                const instance = getComponentInstance(payload.nodeId, i18n)
                instance && api.highlightElement(instance)
              }
            }
          })

          api.on.editInspectorState(payload => {
            if (
              payload.app === app &&
              payload.inspectorId === VueDevToolsIDs.CUSTOM_INSPECTOR
            ) {
              editScope(payload, i18n)
            }
          })

          api.addTimelineLayer({
            id: VueDevToolsIDs.TIMELINE,
            label: VueDevToolsLabels[VueDevToolsIDs.TIMELINE],
            color: VueDevToolsTimelineColors[VueDevToolsIDs.TIMELINE]
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getI18nScopeLable(instance: any): string {
  return (
    instance.type.name ||
    instance.type.displayName ||
    instance.type.__file ||
    'Anonymous'
  )
}

function updateComponentTreeTags(
  instance: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  treeNode: ComponentTreeNode,
  i18n: _I18n
): void {
  // prettier-ignore
  const global = i18n.mode === 'composition'
    ? i18n.global
    : (i18n.global as unknown as VueI18nInternal).__composer
  if (instance && instance.vnode.el.__VUE_I18N__) {
    // add custom tags local scope only
    if (instance.vnode.el.__VUE_I18N__ !== global) {
      const tag = {
        label: `i18n (${getI18nScopeLable(instance)} Scope)`,
        textColor: 0x000000,
        backgroundColor: 0xffcd19
      }
      treeNode.tags.push(tag)
    }
  }
}

function inspectComposer(
  instanceData: InspectedComponentData,
  composer: Composer
): void {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLocaleMessageValue(messages: any): Record<string, unknown> {
  const value: Record<string, unknown> = {}
  Object.keys(messages).forEach((key: string) => {
    const v: unknown = messages[key]
    if (isFunction(v) && 'source' in v) {
      value[key] = getMessageFunctionDetails(v)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMessageFunctionDetails(func: any): Record<string, unknown> {
  const argString = func.source ? `("${escape(func.source)}")` : `(?)`
  return {
    _custom: {
      type: 'function',
      display: `<span>ƒ</span> ${argString}`
    }
  }
}

function registerScope(
  payload: HookPayloads[Hooks.GET_INSPECTOR_TREE],
  i18n: _I18n
): void {
  payload.rootNodes.push({
    id: 'global',
    label: 'Global Scope'
  })
  // prettier-ignore
  const global = i18n.mode === 'composition'
    ? i18n.global
    : (i18n.global as unknown as VueI18nInternal).__composer
  for (const [keyInstance, instance] of i18n.__instances) {
    // prettier-ignore
    const composer = i18n.mode === 'composition'
      ? instance
      : (instance as unknown as VueI18nInternal).__composer
    if (global === composer) {
      continue
    }
    payload.rootNodes.push({
      id: composer.id.toString(),
      label: `${getI18nScopeLable(keyInstance)} Scope`
    })
  }
}

function getComponentInstance(
  nodeId: string,
  i18n: _I18n
): ComponentInternalInstance | null {
  let instance: ComponentInternalInstance | null = null

  if (nodeId !== 'global') {
    for (const [component, composer] of i18n.__instances.entries()) {
      if (composer.id.toString() === nodeId) {
        instance = component
        break
      }
    }
  }

  return instance
}

function getComposer(nodeId: string, i18n: _I18n): Composer | null {
  if (nodeId === 'global') {
    return i18n.mode === 'composition'
      ? ((i18n.global as unknown) as Composer)
      : ((i18n.global as unknown) as VueI18nInternal).__composer
  } else {
    const instance = Array.from(i18n.__instances.values()).find(
      item => item.id.toString() === nodeId
    )
    if (instance) {
      return i18n.mode === 'composition'
        ? ((instance as unknown) as Composer)
        : ((instance as unknown) as VueI18nInternal).__composer
    } else {
      return null
    }
  }
}

function inspectScope(
  payload: HookPayloads[Hooks.GET_INSPECTOR_STATE],
  i18n: _I18n
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const composer = getComposer(payload.nodeId, i18n)
  if (composer) {
    // TODO:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      layerId: VueDevToolsIDs.TIMELINE,
      event: {
        title: event,
        groupId,
        time: Date.now(),
        meta: {},
        data: payload || {},
        logType:
          event === VueDevToolsTimelineEvents.COMPILE_ERROR
            ? 'error'
            : event === VueDevToolsTimelineEvents.FALBACK ||
              event === VueDevToolsTimelineEvents.MISSING
            ? 'warning'
            : 'default'
      }
    })
  }
}

function editScope(
  payload: HookPayloads[Hooks.EDIT_INSPECTOR_STATE],
  i18n: _I18n
): void {
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

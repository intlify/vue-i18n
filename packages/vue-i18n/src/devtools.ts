import {
  setupDevtoolsPlugin,
  Hooks,
  ComponentTreeNode
} from '@vue/devtools-api'
import {
  DevToolsIDs,
  DevToolsTimelineColors,
  DevToolsLabels,
  DevToolsPlaceholders,
  DevToolsTimelineEvents
} from '@intlify/core-base'
import {
  isFunction,
  isString,
  isBoolean,
  isObject,
  isArray
} from '@intlify/shared'

import type { App } from 'vue'
import type {
  DevtoolsPluginApi,
  InspectedComponentData,
  CustomInspectorState,
  ComponentStateBase,
  HookPayloads
} from '@vue/devtools-api'
import type { DevToolsTimelineEventPayloads } from '@intlify/core-base'
import type { I18n, I18nInternal } from './i18n'
import type { Composer } from './composer'
import type { VueI18nInternal } from './legacy'

type _I18n<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
> = I18n<Messages, DateTimeFormats, NumberFormats, Legacy> & I18nInternal

let devtoolsApi: DevtoolsPluginApi

export async function enableDevTools<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  app: App,
  i18n: _I18n<Messages, DateTimeFormats, NumberFormats, Legacy>
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      setupDevtoolsPlugin(
        {
          id: DevToolsIDs.PLUGIN,
          label: DevToolsLabels[DevToolsIDs.PLUGIN],
          app
        },
        api => {
          devtoolsApi = api

          api.on.visitComponentTree(({ componentInstance, treeNode }) => {
            updateComponentTreeTags(componentInstance, treeNode, i18n)
          })

          api.on.inspectComponent(({ componentInstance, instanceData }) => {
            if (componentInstance.vnode.el.__INTLIFY__ && instanceData) {
              if (i18n.mode === 'legacy') {
                // ignore global scope on legacy mode
                if (
                  componentInstance.vnode.el.__INTLIFY__ !==
                  ((i18n.global as unknown) as VueI18nInternal).__composer
                ) {
                  inspectComposer(
                    instanceData,
                    componentInstance.vnode.el.__INTLIFY__ as Composer
                  )
                }
              } else {
                inspectComposer(
                  instanceData,
                  componentInstance.vnode.el.__INTLIFY__ as Composer
                )
              }
            }
          })

          api.addInspector({
            id: DevToolsIDs.CUSTOM_INSPECTOR,
            label: DevToolsLabels[DevToolsIDs.CUSTOM_INSPECTOR],
            icon: 'language',
            treeFilterPlaceholder:
              DevToolsPlaceholders[DevToolsIDs.CUSTOM_INSPECTOR]
          })

          api.on.getInspectorTree(payload => {
            if (
              payload.app === app &&
              payload.inspectorId === DevToolsIDs.CUSTOM_INSPECTOR
            ) {
              registerScope(payload, i18n)
            }
          })

          api.on.getInspectorState(payload => {
            if (
              payload.app === app &&
              payload.inspectorId === DevToolsIDs.CUSTOM_INSPECTOR
            ) {
              inspectScope(payload, i18n)
            }
          })

          api.on.editInspectorState(payload => {
            if (
              payload.app === app &&
              payload.inspectorId === DevToolsIDs.CUSTOM_INSPECTOR
            ) {
              editScope(payload, i18n)
            }
          })

          api.addTimelineLayer({
            id: DevToolsIDs.TIMELINE,
            label: DevToolsLabels[DevToolsIDs.TIMELINE],
            color: DevToolsTimelineColors[DevToolsIDs.TIMELINE]
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

function updateComponentTreeTags<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  instance: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  treeNode: ComponentTreeNode,
  i18n: _I18n<Messages, DateTimeFormats, NumberFormats, Legacy>
): void {
  // prettier-ignore
  const global = i18n.mode === 'composition'
    ? i18n.global
    : (i18n.global as unknown as VueI18nInternal).__composer
  if (instance && instance.vnode.el.__INTLIFY__) {
    // add custom tags local scope only
    if (instance.vnode.el.__INTLIFY__ !== global) {
      const label =
        instance.type.name || instance.type.displayName || instance.type.__file
      const tag = {
        label: `i18n (${label} Scope)`,
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
  const type = 'vue-i18n: composer properties'
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

function registerScope<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  payload: HookPayloads[Hooks.GET_INSPECTOR_TREE],
  i18n: _I18n<Messages, DateTimeFormats, NumberFormats, Legacy>
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
    const label =
      keyInstance.type.name ||
      keyInstance.type.displayName ||
      keyInstance.type.__file
    payload.rootNodes.push({
      id: composer.id.toString(),
      label: `${label} Scope`
    })
  }
}

function getComposer<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  nodeId: string,
  i18n: _I18n<Messages, DateTimeFormats, NumberFormats, Legacy>
): Composer<Messages, DateTimeFormats, NumberFormats> | null {
  if (nodeId === 'global') {
    return i18n.mode === 'composition'
      ? (i18n.global as Composer<Messages, DateTimeFormats, NumberFormats>)
      : ((i18n.global as unknown) as VueI18nInternal<
          Messages,
          DateTimeFormats,
          NumberFormats
        >).__composer
  } else {
    const instance = Array.from(i18n.__instances.values()).find(
      item => item.id.toString() === nodeId
    )
    if (instance) {
      return i18n.mode === 'composition'
        ? (instance as Composer<Messages, DateTimeFormats, NumberFormats>)
        : ((instance as unknown) as VueI18nInternal<
            Messages,
            DateTimeFormats,
            NumberFormats
          >).__composer
    } else {
      return null
    }
  }
}

function inspectScope<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  payload: HookPayloads[Hooks.GET_INSPECTOR_STATE],
  i18n: _I18n<Messages, DateTimeFormats, NumberFormats, Legacy>
): void {
  const composer = getComposer(payload.nodeId, i18n)
  if (composer) {
    payload.state = makeScopeInspectState(composer)
  }
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
  event: DevToolsTimelineEvents,
  payload?: DevToolsTimelineEventPayloads[DevToolsTimelineEvents]
): void {
  if (devtoolsApi) {
    let groupId: string | undefined
    if (payload && 'groupId' in payload) {
      groupId = payload.groupId
      delete payload.groupId
    }
    devtoolsApi.addTimelineEvent({
      layerId: DevToolsIDs.TIMELINE,
      event: {
        title: event,
        groupId,
        time: Date.now(),
        meta: {},
        data: payload || {},
        logType:
          event === DevToolsTimelineEvents.COMPILE_ERROR
            ? 'error'
            : event === DevToolsTimelineEvents.FALBACK ||
              event === DevToolsTimelineEvents.MISSING
            ? 'warning'
            : 'default'
      }
    })
  }
}

function editScope<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  payload: HookPayloads[Hooks.EDIT_INSPECTOR_STATE],
  i18n: _I18n<Messages, DateTimeFormats, NumberFormats, Legacy>
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

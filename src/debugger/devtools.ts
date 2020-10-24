import { App } from 'vue'
import {
  setupDevtoolsPlugin,
  DevtoolsPluginApi,
  InspectedComponentData,
  CustomInspectorNode,
  CustomInspectorState,
  ComponentStateBase,
  HookPayloads,
  Hooks
} from '@vue/devtools-api'
import { I18n, I18nInternal } from '../i18n'
import { Composer } from '../composer'
import { VueI18nInternal } from '../legacy'
import {
  DevToolsIDs,
  DevToolsTimelineColors,
  DevToolsLabels,
  DevToolsPlaceholders,
  DevToolsTimelineEvents,
  DevToolsTimelineEventPayloads,
  DevToolsTimelineLayerMaps
} from './constants'

type _I18n<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
> = I18n<Messages, DateTimeFormats, NumberFormats, Legacy> & I18nInternal

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

export function devtoolsRegisterI18n<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  i18n: I18n<Messages, DateTimeFormats, NumberFormats, Legacy>,
  version: string
): void {
  if (!devtools) {
    return
  }
  devtools.emit(DevtoolsHooks.REGISTER, i18n, version)
}

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

          api.on.inspectComponent(payload => {
            const componentInstance = payload.componentInstance
            if (
              componentInstance.vnode.el.__INTLIFY__ &&
              payload.instanceData
            ) {
              inspectComposer(
                payload.instanceData,
                componentInstance.vnode.el.__INTLIFY__ as Composer
              )
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

          api.addTimelineLayer({
            id: DevToolsIDs.TIMELINE_COMPILE_ERROR,
            label: DevToolsLabels[DevToolsIDs.TIMELINE_COMPILE_ERROR],
            color: DevToolsTimelineColors[DevToolsIDs.TIMELINE_COMPILE_ERROR]
          })

          api.addTimelineLayer({
            id: DevToolsIDs.TIMELINE_PERFORMANCE,
            label: DevToolsLabels[DevToolsIDs.TIMELINE_PERFORMANCE],
            color: DevToolsTimelineColors[DevToolsIDs.TIMELINE_PERFORMANCE]
          })

          api.addTimelineLayer({
            id: DevToolsIDs.TIMELINE_MISSING,
            label: DevToolsLabels[DevToolsIDs.TIMELINE_MISSING],
            color: DevToolsTimelineColors[DevToolsIDs.TIMELINE_MISSING]
          })

          api.addTimelineLayer({
            id: DevToolsIDs.TIMELINE_FALLBACK,
            label: DevToolsLabels[DevToolsIDs.TIMELINE_FALLBACK],
            color: DevToolsTimelineColors[DevToolsIDs.TIMELINE_FALLBACK]
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

function inspectComposer(
  instanceData: InspectedComponentData,
  composer: Composer
): void {
  const type = 'vue-i18n: composer properties'
  instanceData.state.push({
    type,
    key: 'locale',
    editable: false,
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
    editable: false,
    value: composer.fallbackLocale.value
  })
  instanceData.state.push({
    type,
    key: 'inheritLocale',
    editable: false,
    value: composer.inheritLocale
  })
  instanceData.state.push({
    type,
    key: 'messages',
    editable: false,
    value: composer.messages.value
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

function registerScope<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  payload: HookPayloads[Hooks.GET_INSPECTOR_TREE],
  i18n: _I18n<Messages, DateTimeFormats, NumberFormats, Legacy>
): void {
  const children: CustomInspectorNode[] = []
  for (const [keyInstance, instance] of i18n.__instances) {
    // prettier-ignore
    const composer = i18n.mode === 'composition'
      ? instance
      : (instance as unknown as VueI18nInternal).__composer
    const label =
      keyInstance.type.name ||
      keyInstance.type.displayName ||
      keyInstance.type.__file
    children.push({
      id: composer.id.toString(),
      label: `${label} Scope`
    })
  }
  payload.rootNodes.push({
    id: 'global',
    label: 'Global Scope',
    children
  })
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
  if (payload.nodeId === 'global') {
    payload.state = makeScopeInspectState(
      i18n.mode === 'composition'
        ? (i18n.global as Composer)
        : ((i18n.global as unknown) as VueI18nInternal).__composer
    )
  } else {
    const instance = Array.from(i18n.__instances.values()).find(
      item => item.id.toString() === payload.nodeId
    )
    if (instance) {
      const composer =
        i18n.mode === 'composition'
          ? (instance as Composer)
          : ((instance as unknown) as VueI18nInternal).__composer
      payload.state = makeScopeInspectState(composer)
    }
  }
}

function makeScopeInspectState(composer: Composer): CustomInspectorState {
  const state: CustomInspectorState = {}

  const localeType = 'Locale related info'
  const localeStates: ComponentStateBase[] = [
    {
      type: localeType,
      key: 'locale',
      editable: false,
      value: composer.locale.value
    },
    {
      type: localeType,
      key: 'fallbackLocale',
      editable: false,
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
      editable: false,
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
      value: composer.messages.value
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
    devtoolsApi.addTimelineEvent({
      layerId: DevToolsTimelineLayerMaps[event],
      event: {
        time: Date.now(),
        meta: {},
        data: payload || {}
      }
    })
  }
}

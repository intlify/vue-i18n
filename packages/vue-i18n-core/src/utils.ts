/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isArray,
  isObject,
  hasOwn,
  isPlainObject,
  isString,
  deepCopy,
  warn
} from '@intlify/shared'
import { Text, createVNode } from 'vue'
import { I18nWarnCodes, getWarnMessage } from './warnings'

import type { Locale, MessageResolver } from '@intlify/core-base'
import type {
  Composer,
  ComposerOptions,
  CustomBlocks,
  VueMessageType
} from './composer'
import type {
  ComponentInternalInstance,
  RendererNode,
  RendererElement
} from 'vue'

type GetLocaleMessagesOptions<Messages = {}> = {
  messages?: { [K in keyof Messages]: Messages[K] }
  __i18n?: CustomBlocks<VueMessageType>
  messageResolver?: MessageResolver
  flatJson?: boolean
}

declare module 'vue' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface VNode<HostNode = RendererNode, HostElement = RendererElement> {
    toString: () => string // mark for vue-i18n message runtime
  }
}

/**
 * Transform flat json in obj to normal json in obj
 */
export function handleFlatJson(obj: unknown): unknown {
  // check obj
  if (!isObject(obj)) {
    return obj
  }

  for (const key in obj as object) {
    // check key
    if (!hasOwn(obj, key)) {
      continue
    }

    // handle for normal json
    if (!key.includes('.')) {
      // recursive process value if value is also a object
      if (isObject(obj[key])) {
        handleFlatJson(obj[key])
      }
    }
    // handle for flat json, transform to normal json
    else {
      // go to the last object
      const subKeys = key.split('.')
      const lastIndex = subKeys.length - 1
      let currentObj = obj
      let hasStringValue = false
      for (let i = 0; i < lastIndex; i++) {
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = {}
        }
        if (!isObject(currentObj[subKeys[i]])) {
          __DEV__ &&
            warn(
              getWarnMessage(I18nWarnCodes.IGNORE_OBJ_FLATTEN, {
                key: subKeys[i]
              })
            )
          hasStringValue = true
          break
        }
        currentObj = currentObj[subKeys[i]]
      }
      // update last object value, delete old property
      if (!hasStringValue) {
        currentObj[subKeys[lastIndex]] = obj[key]
        delete obj[key]
      }
      // recursive process value if value is also a object
      if (isObject(currentObj[subKeys[lastIndex]])) {
        handleFlatJson(currentObj[subKeys[lastIndex]])
      }
    }
  }

  return obj
}

export function getLocaleMessages<Messages = {}>(
  locale: Locale,
  options: GetLocaleMessagesOptions<Messages>
): { [K in keyof Messages]: Messages[K] } {
  const { messages, __i18n, messageResolver, flatJson } = options

  // prettier-ignore
  const ret = (isPlainObject(messages)
    ? messages
    : isArray(__i18n)
      ? {}
      : { [locale]: {} }) as Record<string, any>

  // merge locale messages of i18n custom block
  if (isArray(__i18n)) {
    __i18n.forEach(custom => {
      if ('locale' in custom && 'resource' in custom) {
        const { locale, resource } = custom
        if (locale) {
          ret[locale] = ret[locale] || {}
          deepCopy(resource, ret[locale])
        } else {
          deepCopy(resource, ret)
        }
      } else {
        isString(custom) && deepCopy(JSON.parse(custom), ret)
      }
    })
  }

  // handle messages for flat json
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key])
      }
    }
  }

  return ret as { [K in keyof Messages]: Messages[K] }
}

export function getComponentOptions(instance: ComponentInternalInstance): any {
  return instance.type
}

export function adjustI18nResources(
  gl: Composer,
  options: ComposerOptions,
  componentOptions: any
): void {
  let messages = isObject(options.messages) ? options.messages : {}
  if ('__i18nGlobal' in componentOptions) {
    messages = getLocaleMessages(gl.locale.value as Locale, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    })
  }
  // merge locale messages
  const locales = Object.keys(messages)
  if (locales.length) {
    locales.forEach(locale => {
      gl.mergeLocaleMessage(locale, messages[locale])
    })
  }
  if (!__LITE__) {
    // merge datetime formats
    if (isObject(options.datetimeFormats)) {
      const locales = Object.keys(options.datetimeFormats)
      if (locales.length) {
        locales.forEach(locale => {
          gl.mergeDateTimeFormat(locale, options.datetimeFormats![locale])
        })
      }
    }
    // merge number formats
    if (isObject(options.numberFormats)) {
      const locales = Object.keys(options.numberFormats)
      if (locales.length) {
        locales.forEach(locale => {
          gl.mergeNumberFormat(locale, options.numberFormats![locale])
        })
      }
    }
  }
}

export function createTextNode(key: string): any {
  return createVNode(Text, null, key, 0)
}

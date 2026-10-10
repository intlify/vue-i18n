import { AST_NODE_PROPS_KEYS, isMessageAST } from '@intlify/core-base'
import {
  create,
  deepCopy,
  getOwn,
  hasOwn,
  isArray,
  isObject,
  isObjectPrototypeKey,
  isPlainObject,
  isString,
  warn
} from '@intlify/shared'
import { Text, createVNode } from 'vue'
import { I18nWarnCodes, getWarnMessage } from './warnings'

import type { Locale, MessageResolver } from '@intlify/core-base'
import type { RendererElement, RendererNode } from 'vue'
import type { Composer, ComposerOptions, CustomBlocks, VueMessageType } from './composer'

type GetLocaleMessagesOptions<Messages = {}> = {
  messages?: { [K in keyof Messages]: Messages[K] }
  __i18n?: CustomBlocks<VueMessageType>
  messageResolver?: MessageResolver
  flatJson?: boolean
}

declare module 'vue' {
  // oxlint-disable-next-line @typescript-eslint/no-unused-vars -- type declaration
  interface VNode<HostNode = RendererNode, HostElement = RendererElement> {
    toString: () => string // mark for vue-i18n message runtime
  }
}

/**
 * Whether `locale` can't be a key of the locale messages and formats.
 * A property name of `Object.prototype`, such as `__proto__` or `constructor`, would read or replace
 * a built-in object, so it is ignored with a warning.
 */
export function isUnsafeLocale(locale: Locale): boolean {
  if (isObjectPrototypeKey(locale)) {
    __DEV__ && warn(getWarnMessage(I18nWarnCodes.IGNORE_UNSAFE_LOCALE, { locale }))
    return true
  }
  return false
}

/**
 * Copy the locales of `resources` into a new object, so that the composer adds and replaces
 * locales in its own object, not in the one the application passed in.
 * The locales themselves are shared until they are written into (see `copyMerge()`).
 * Locales named after `Object.prototype` properties are skipped, as `isUnsafeLocale()` does on write.
 */
export function copyResources<Resources extends object>(resources: Resources): Resources {
  const ret = {} as Record<string, unknown>
  const locales = Object.keys(resources)
  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i]
    if (!isUnsafeLocale(locale)) {
      ret[locale] = (resources as Record<string, unknown>)[locale]
    }
  }
  return ret as Resources
}

/**
 * Deep copy `sources` into a new object, later ones over earlier ones, without writing into any of them.
 * `null` and `undefined` are skipped.
 */
export function copyMerge(...sources: unknown[]): Record<string, any> {
  const ret = {}
  for (let i = 0; i < sources.length; i++) {
    if (sources[i] != null) {
      deepCopy(sources[i], ret)
    }
  }
  return ret
}

/**
 * Transform flat json in obj to normal json in obj
 */
export function handleFlatJson(obj: unknown): unknown {
  // check obj
  if (!isObject(obj)) {
    return obj
  }

  if (isMessageAST(obj)) {
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
        if (subKeys[i] === '__proto__') {
          throw new Error(`unsafe key: ${subKeys[i]}`)
        }
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = create()
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
        if (!isMessageAST(currentObj)) {
          currentObj[subKeys[lastIndex]] = obj[key]
          delete obj[key]
        } else {
          /**
           * NOTE:
           * if the last object is a message AST and subKeys[lastIndex] has message AST prop key, ignore to copy and key deletion
           */
          if (!AST_NODE_PROPS_KEYS.includes(subKeys[lastIndex])) {
            delete obj[key]
          }
        }
      }

      // recursive process value if value is also a object
      if (!isMessageAST(currentObj)) {
        const target = currentObj[subKeys[lastIndex]]
        if (isObject(target)) {
          handleFlatJson(target)
        }
      }
    }
  }

  return obj
}

/**
 * Get the locale messages for a composer from its `messages` option and SFC custom blocks.
 * The returned object is a copy: the objects that the application passed in are not written into.
 * The locales that are copied by this function are added to `copied`.
 */
export function getLocaleMessages<Messages = {}>(
  locale: Locale,
  options: GetLocaleMessagesOptions<Messages>,
  copied: Set<string> = new Set()
): { [K in keyof Messages]: Messages[K] } {
  const { messages, __i18n, messageResolver, flatJson } = options

  // prettier-ignore
  const ret = (isPlainObject(messages)
    ? copyResources(messages)
    : isArray(__i18n)
      ? create()
      : { [locale]: create() }) as Record<string, any>

  // copy a locale before the first write into it, then write into the copy
  const mergeLocale = (locale: string, resource: unknown) => {
    if (isUnsafeLocale(locale)) {
      return
    }
    if (copied.has(locale)) {
      deepCopy(resource, ret[locale])
    } else {
      ret[locale] = copyMerge(getOwn(ret, locale), resource)
      copied.add(locale)
    }
  }
  const mergeLocales = (resources: unknown) => {
    if (!isPlainObject(resources)) {
      deepCopy(resources, create()) // throws for an invalid resource, as copying it did before
      return
    }
    const locales = Object.keys(resources)
    for (let i = 0; i < locales.length; i++) {
      const value = (resources as Record<string, unknown>)[locales[i]]
      if (isPlainObject(value)) {
        mergeLocale(locales[i], value)
      } else if (!isUnsafeLocale(locales[i])) {
        ret[locales[i]] = value
        copied.delete(locales[i])
      }
    }
  }

  // merge locale messages of i18n custom block
  if (isArray(__i18n)) {
    __i18n.forEach(custom => {
      if ('locale' in custom && 'resource' in custom) {
        const { locale, resource } = custom
        if (locale) {
          mergeLocale(locale, resource)
        } else {
          mergeLocales(resource)
        }
      } else {
        isString(custom) && mergeLocales(JSON.parse(custom))
      }
    })
  }

  // handle messages for flat json
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        // `handleFlatJson()` rewrites the object in place, so copy the locales from the application first
        if (!copied.has(key) && isPlainObject(ret[key])) {
          ret[key] = copyMerge(ret[key])
          copied.add(key)
        }
        handleFlatJson(ret[key])
      }
    }
  }

  return ret as { [K in keyof Messages]: Messages[K] }
}

export function adjustI18nResources(
  gl: Composer,
  options: ComposerOptions,
  componentOptions: any
): void {
  // prettier-ignore
  let messages = isObject(options.messages)
    ? options.messages
    : create() as NonNullable<ComposerOptions['messages']>
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

import { watch } from 'vue'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { createI18nError, I18nErrorCodes } from './errors'
import {
  isString,
  isPlainObject,
  isNumber,
  warn,
  inBrowser
} from '@intlify/shared'

import type {
  DirectiveBinding,
  ObjectDirective,
  WatchStopHandle,
  ComponentInternalInstance,
  VNode
} from 'vue'
import type { I18n, I18nInternal } from './i18n'
import type { VueI18nInternal } from './legacy'
import type { Composer } from './composer'
import type { Locale, TranslateOptions, NamedValue } from '@intlify/core-base'

type VTDirectiveValue = {
  path: string
  locale?: Locale
  args?: NamedValue
  choice?: number
  plural?: number
}

declare global {
  interface HTMLElement {
    __i18nWatcher?: WatchStopHandle
    __composer?: Composer
  }
}

function getComposer(
  i18n: I18n,
  instance: ComponentInternalInstance
): Composer {
  const i18nInternal = i18n as unknown as I18nInternal
  if (i18n.mode === 'composition') {
    return (i18nInternal.__getInstance(instance) || i18n.global) as Composer
  } else {
    const vueI18n = i18nInternal.__getInstance(instance)
    return vueI18n != null
      ? (vueI18n as unknown as VueI18nInternal).__composer
      : (i18n.global as unknown as VueI18nInternal).__composer
  }
}

/**
 * Translation Directive (`v-t`)
 *
 * @remarks
 * Update the element `textContent` that localized with locale messages.
 *
 * You can use string syntax or object syntax.
 *
 * String syntax can be specified as a keypath of locale messages.
 *
 * If you can be used object syntax, you need to specify as the object key the following params
 *
 * ```
 * - path: required, key of locale messages
 * - locale: optional, locale
 * - args: optional, for list or named formatting
 * ```
 *
 * @example
 * ```html
 * <!-- string syntax: literal -->
 * <p v-t="'foo.bar'"></p>
 *
 * <!-- string syntax: binding via data or computed props -->
 * <p v-t="msg"></p>
 *
 * <!-- object syntax: literal -->
 * <p v-t="{ path: 'hi', locale: 'ja', args: { name: 'kazupon' } }"></p>
 *
 * <!-- object syntax: binding via data or computed props -->
 * <p v-t="{ path: greeting, args: { name: fullName } }"></p>
 * ```
 *
 * @VueI18nDirective
 */
export type TranslationDirective<T = HTMLElement> = ObjectDirective<T>

export function vTDirective(i18n: I18n): TranslationDirective<HTMLElement> {
  const register = (
    el: HTMLElement,
    { instance, value, modifiers }: DirectiveBinding
  ): void => {
    /* istanbul ignore if */
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
    }

    const composer = getComposer(i18n, instance.$)
    if (__DEV__ && modifiers.preserve) {
      warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE))
    }

    const parsedValue = parseValue(value)
    if (inBrowser && i18n.global === composer) {
      // global scope only
      el.__i18nWatcher = watch(composer.locale, () => {
        instance.$forceUpdate()
      })
    }
    el.__composer = composer
    el.textContent = Reflect.apply(composer.t, composer, [
      ...makeParams(parsedValue)
    ])
  }

  const unregister = (el: HTMLElement): void => {
    if (inBrowser && el.__i18nWatcher) {
      el.__i18nWatcher()
      el.__i18nWatcher = undefined
      delete el.__i18nWatcher
    }
    if (el.__composer) {
      el.__composer = undefined
      delete el.__composer
    }
  }

  const update = (el: HTMLElement, { value }: DirectiveBinding): void => {
    if (el.__composer) {
      const composer = el.__composer
      const parsedValue = parseValue(value)
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ])
    }
  }

  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSSRProps: (binding: DirectiveBinding, vnode: VNode) => {
      // TODO: support SSR
      throw new Error('v-t still is not supported in SSR fully')
    }
  } as TranslationDirective<HTMLElement>
}

function parseValue(value: unknown): VTDirectiveValue {
  if (isString(value)) {
    return { path: value }
  } else if (isPlainObject(value)) {
    if (!('path' in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, 'path')
    }
    return value as VTDirectiveValue
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE)
  }
}

function makeParams(value: VTDirectiveValue): unknown[] {
  const { path, locale, args, choice, plural } = value
  const options = {} as TranslateOptions
  const named: NamedValue = args || {}

  if (isString(locale)) {
    options.locale = locale
  }

  if (isNumber(choice)) {
    options.plural = choice
  }

  if (isNumber(plural)) {
    options.plural = plural
  }

  return [path, named, options]
}

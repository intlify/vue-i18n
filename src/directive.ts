import {
  DirectiveBinding,
  ObjectDirective,
  ComponentInternalInstance
} from 'vue'
import { I18n, I18nInternal } from './i18n'
import { VueI18n, VueI18nInternal } from './legacy'
import { Composer } from './composer'
import { Locale, TranslateOptions } from './core'
import { NamedValue } from './message/runtime'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { isString, isPlainObject, isNumber, warn } from './utils'

type VTDirectiveValue = {
  path: string
  locale?: Locale
  args?: NamedValue
  choice?: number
}

function getComposer(
  i18n: I18n & I18nInternal,
  instance: ComponentInternalInstance
): Composer | null {
  if (i18n.mode === 'composable') {
    return i18n._getComposer(instance) || i18n.global
  } else {
    const vueI18n = i18n._getLegacy(instance)
    return vueI18n != null
      ? (vueI18n as VueI18n & VueI18nInternal).__composer
      : i18n.global
  }
}

export function vTDirective(
  i18n: I18n & I18nInternal
): ObjectDirective<HTMLElement> {
  const bind = (
    el: HTMLElement,
    { instance, value, modifiers }: DirectiveBinding
  ): void => {
    if (!instance || !instance.$) {
      // TODO: should be raise Vue error
      throw new Error('TODO')
    }

    const composer = getComposer(i18n, instance.$)
    if (!composer) {
      // TODO: should be error
      throw new Error('TODO')
    }

    if (__DEV__ && modifiers.preserve) {
      warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE))
    }

    const parsedValue = parseValue(value)
    el.innerText = composer.t(...makeParams(parsedValue))
  }

  return {
    beforeMount: bind,
    beforeUpdate: bind
  } as ObjectDirective<HTMLElement>
}

function parseValue(value: unknown): VTDirectiveValue {
  if (isString(value)) {
    return { path: value }
  } else if (isPlainObject(value)) {
    if (!('path' in value)) {
      throw new Error('TODO')
    }
    return value as VTDirectiveValue
  } else {
    throw new Error('TODO')
  }
}

function makeParams(value: VTDirectiveValue): unknown[] {
  const { path, locale, args, choice } = value
  const options = {} as TranslateOptions
  const named: NamedValue = args || {}

  if (isString(locale)) {
    options.locale = locale
  }

  if (isNumber(choice)) {
    options.plural = choice
  }

  return [path, named, options]
}

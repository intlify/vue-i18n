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
import { createI18nError, I18nErrorCodes } from './errors'

type VTDirectiveValue = {
  path: string
  locale?: Locale
  args?: NamedValue
  choice?: number
  plural?: number
}

function getComposer<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  i18n: I18n<Messages, DateTimeFormats, NumberFormats, Legacy>,
  instance: ComponentInternalInstance
): Composer<Messages, DateTimeFormats, NumberFormats> {
  const i18nInternal = (i18n as unknown) as I18nInternal
  if (i18n.mode === 'composition') {
    return (i18nInternal.__getInstance<
      Messages,
      DateTimeFormats,
      NumberFormats,
      Composer<Messages, DateTimeFormats, NumberFormats>
    >(instance) || i18n.global) as Composer<
      Messages,
      DateTimeFormats,
      NumberFormats
    >
  } else {
    const vueI18n = i18nInternal.__getInstance<
      Messages,
      DateTimeFormats,
      NumberFormats,
      VueI18n<Messages, DateTimeFormats, NumberFormats>
    >(instance)
    return vueI18n != null
      ? ((vueI18n as unknown) as VueI18nInternal<
          Messages,
          DateTimeFormats,
          NumberFormats
        >).__composer
      : ((i18n.global as unknown) as VueI18nInternal<
          Messages,
          DateTimeFormats,
          NumberFormats
        >).__composer
  }
}

export function vTDirective<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  i18n: I18n<Messages, DateTimeFormats, NumberFormats, Legacy>
): ObjectDirective<HTMLElement> {
  const bind = (
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
    el.textContent = composer.t(...makeParams(parsedValue))
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

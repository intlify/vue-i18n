import { h, Fragment } from 'vue'
import { isString, isObject, isArray } from '@intlify/shared'

import type {
  RenderFunction,
  SetupContext,
  VNodeChild,
  VNodeArrayChildren
} from 'vue'
import type { NumberOptions, DateTimeOptions } from '@intlify/core-base'
import type { BaseFormatProps } from './base'

/**
 * Formattable Props
 *
 * @remarks
 * The props used in DatetimeFormat, or NumberFormat component
 *
 * @VueI18nComponent
 */
export interface FormattableProps<Value, Format> extends BaseFormatProps {
  /**
   * @remarks
   * The value specified for the target component
   */
  value: Value
  /**
   * @remarks
   * The format to use in the target component.
   *
   * Specify the format key string or the format as defined by the Intl API in ECMA 402.
   */
  format?: string | Format
}

type FormatOptions = NumberOptions | DateTimeOptions
type FormatPartReturn = Intl.NumberFormatPart | Intl.DateTimeFormatPart
type FormatOverrideOptions =
  | Intl.NumberFormatOptions
  | Intl.DateTimeFormatOptions

export function renderFormatter<
  Props extends FormattableProps<Value, Format>,
  Value,
  Format extends FormatOverrideOptions,
  Arg extends FormatOptions,
  Return extends FormatPartReturn
>(
  props: Props,
  context: SetupContext,
  slotKeys: string[],
  partFormatter: (...args: unknown[]) => string | Return[]
): RenderFunction {
  const { slots, attrs } = context

  return (): VNodeChild => {
    const options = { part: true } as Arg
    let overrides = {} as FormatOverrideOptions

    if (props.locale) {
      options.locale = props.locale
    }

    if (isString(props.format)) {
      options.key = props.format
    } else if (isObject(props.format)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isString((props.format as any).key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options.key = (props.format as any).key
      }
      // Filter out number format options only
      overrides = Object.keys(props.format).reduce((options, prop) => {
        return slotKeys.includes(prop)
          ? Object.assign({}, options, { [prop]: (props.format as any)[prop] }) // eslint-disable-line @typescript-eslint/no-explicit-any
          : options
      }, {})
    }

    const parts = partFormatter(...[props.value, options, overrides])
    let children = [options.key] as VNodeArrayChildren
    if (isArray(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type]
        return slot
          ? slot({ [part.type]: part.value, index, parts })
          : [part.value]
      })
    } else if (isString(parts)) {
      children = [parts]
    }

    // prettier-ignore
    return isString(props.tag)
      ? h(props.tag, { ...attrs }, children)
      : isObject(props.tag)
        ? h(props.tag, { ...attrs }, children)
        : h(Fragment, { ...attrs }, children)
  }
}

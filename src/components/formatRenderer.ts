import {
  h,
  RenderFunction,
  Fragment,
  SetupContext,
  VNodeChild,
  VNodeArrayChildren
} from 'vue'
import { NumberOptions, DateTimeOptions } from '../core'
import { isString, isPlainObject, isArray } from '../utils'
import { BaseFormatProps } from './base'

export interface FormattableProps<Value, Format> extends BaseFormatProps {
  value: Value
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
    let orverrides = {} as FormatOverrideOptions

    if (props.locale) {
      options.locale = props.locale
    }

    if (isString(props.format)) {
      options.key = props.format
    } else if (isPlainObject(props.format)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isString((props.format as any).key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options.key = (props.format as any).key
      }
      // Filter out number format options only
      orverrides = Object.keys(props.format).reduce((options, prop) => {
        return slotKeys.includes(prop)
          ? Object.assign({}, options, { [prop]: (props.format as any)[prop] }) // eslint-disable-line @typescript-eslint/no-explicit-any
          : options
      }, {})
    }

    const parts = partFormatter(...[props.value, options, orverrides])
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

    return props.tag
      ? h(props.tag, { ...attrs }, children)
      : h(Fragment, { ...attrs }, children)
  }
}

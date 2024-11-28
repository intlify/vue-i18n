import { assign, create, isArray, isObject, isString } from '@intlify/shared'
import { h } from 'vue'
import { getFragmentableTag } from './utils'

import type { DateTimeOptions, NumberOptions } from '@intlify/core-base'
import type {
  RenderFunction,
  SetupContext,
  VNode,
  VNodeArrayChildren,
  VNodeChild
} from 'vue'
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

function isVNode(target: unknown): target is VNode[] {
  return isArray(target) && !isString(target[0])
}

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
    let overrides = create() as FormatOverrideOptions

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
          ? assign(create(), options, { [prop]: (props.format as any)[prop] }) // eslint-disable-line @typescript-eslint/no-explicit-any
          : options
      }, create())
    }

    const parts = partFormatter(...[props.value, options, overrides])
    let children = [options.key] as VNodeArrayChildren
    if (isArray(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type]
        const node = slot
          ? slot({ [part.type]: part.value, index, parts })
          : [part.value]
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index}`
        }
        return node
      })
    } else if (isString(parts)) {
      children = [parts]
    }

    const assignedAttrs = assign(create(), attrs)
    const tag =
      isString(props.tag) || isObject(props.tag)
        ? props.tag
        : getFragmentableTag()
    return h(tag, assignedAttrs, children)
  }
}

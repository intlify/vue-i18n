import {
  h,
  Fragment,
  defineComponent,
  SetupContext,
  VNodeArrayChildren,
  getCurrentInstance
} from 'vue'
import { useI18n, getComposer } from '../i18n'
import { TranslateOptions, Locale } from '../core'
import { NamedValue } from '../message/runtime'
import { isNumber, isString } from '../utils'

export type TranslationProps = {
  tag?: string
  keypath: string
  locale?: Locale
  plural?: number | string
}

export const Translation = defineComponent({
  /* eslint-disable */
  name: 'i18n-t',
  props: {
    tag: {
      type: String
    },
    keypath: {
      type: String,
      required: true
    },
    locale: {
      type: String
    },
    plural: {
      type: [Number, String],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: (val: any): boolean => isNumber(val) || !isNaN(val)
    }
  },
  /* eslint-enable */
  setup(props: TranslationProps, context: SetupContext) {
    const { slots, attrs } = context
    const instance = getCurrentInstance()
    const i18n =
      instance !== null
        ? instance.parent !== null
          ? getComposer(instance.parent)
          : useI18n()
        : useI18n()
    const keys = Object.keys(slots).filter(key => key !== '_')

    return () => {
      const options = {} as TranslateOptions
      if (props.locale) {
        options.locale = props.locale
      }
      if (props.plural !== undefined) {
        options.plural = isString(props.plural) ? +props.plural : props.plural
      }
      const arg = getInterpolateArg(context, keys)

      const children = i18n.__transrateVNode(
        props.keypath,
        arg,
        options
      ) as VNodeArrayChildren
      return props.tag
        ? h(props.tag, { ...attrs }, children)
        : h(Fragment, { ...attrs }, children)
    }
  }
})

function getInterpolateArg(
  { slots }: SetupContext,
  keys: string[]
): NamedValue | unknown[] {
  if (keys.length === 1 && keys[0] === 'default') {
    // default slot only
    return slots.default ? slots.default() : []
  } else {
    // named slots
    return keys.reduce((arg, key) => {
      const slot = slots[key]
      if (slot) {
        arg[key] = slot()
      }
      return arg
    }, {} as NamedValue)
  }
}

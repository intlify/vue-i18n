import {
  h,
  Fragment,
  defineComponent,
  SetupContext,
  VNodeArrayChildren
} from 'vue'
import { useI18n } from '../i18n'
import { TranslateOptions } from '../runtime/translate'
import { NamedValue } from '../message/context'

export const Translation = defineComponent({
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
    }
  },
  setup(props, context: SetupContext) {
    const { slots, attrs } = context
    const i18n = useI18n()
    const { tag, keypath, locale } = props
    const keys = Object.keys(slots).filter(key => key !== '_')

    const options = {} as TranslateOptions
    if (locale) {
      options.locale = locale
    }
    const arg = getInterpolateArg(context, keys)

    return () => {
      const children = i18n._transrateVNode(
        keypath,
        arg,
        options
      ) as VNodeArrayChildren
      return tag
        ? h(tag, { ...attrs }, children)
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
  return []
}

import { Fragment } from 'vue'
import type { NamedValue } from '@intlify/core-base'

export function getInterpolateArg(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { slots }: any, // SetupContext,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFragmentableTag(tag: string): any {
  return !__BRIDGE__ ? Fragment : tag
}

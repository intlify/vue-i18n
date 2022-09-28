import { Fragment } from 'vue'

import type { NamedValue } from '@intlify/core-base'
import type { VNode } from 'vue'

export function getInterpolateArg(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { slots }: any, // SetupContext,
  keys: string[]
): NamedValue | unknown[] {
  if (keys.length === 1 && keys[0] === 'default') {
    // default slot with list
    const ret: VNode[] = slots.default ? slots.default() : []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ret.reduce((slot: (VNode | typeof Fragment)[], current: any) => {
      return [
        ...slot,
        // prettier-ignore
        ...(!__BRIDGE__
          ? current.type === Fragment ? current.children : [current]
          : current.children ? current.children : [current]
        )
      ]
    }, [])
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

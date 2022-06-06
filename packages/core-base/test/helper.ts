// eumlate VNode interface on intlify
// ref: github.com/vuejs/core/blob/2f07e3460bf51bc1b083f3d03b3d192e042d2d75/packages/runtime-core/src/vnode.ts#L131-L217

type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void

type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>

type VNodeNormalizedChildren =
  | string
  | VNodeArrayChildren
  // | RawSlots
  | null

export interface VNode {
  __v_isVNode: true
  children: VNodeNormalizedChildren
  [field: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function createTextNode(key: string): VNode {
  return {
    __v_isVNode: true,
    children: key
  }
}

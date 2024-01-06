import { isArray, isObject } from './utils'

const isNotObjectOrIsArray = (val: unknown) => !isObject(val) || isArray(val)
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function deepCopy(src: any, des: any): void {
  // src and des should both be objects, and none of them can be a array
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error('Invalid value')
  }

  const stack = [{ src, des }]

  while (stack.length) {
    // @ts-ignore
    const { src, des } = stack.pop()

    Object.keys(src).forEach(key => {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        // For primitive types or null, directly copy the value
        des[key] = src[key]
      } else {
        stack.push({ src: src[key], des: des[key] })
      }
    })
  }
}

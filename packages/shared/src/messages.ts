import { hasOwn, isArray, isObject } from './utils'

const isNotObjectOrIsArray = (val: unknown) => !isObject(val) || isArray(val)
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function deepCopy(src: any, des: any): void {
  // src and des should both be objects, and none of them can be a array
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error('Invalid value')
  }

  for (const key in src) {
    if (hasOwn(src, key)) {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        // replace with src[key] when:
        // src[key] or des[key] is not an object, or
        // src[key] or des[key] is an array
        des[key] = src[key]
      } else {
        // src[key] and des[key] are both objects, merge them
        deepCopy(src[key], des[key])
      }
    }
  }
}

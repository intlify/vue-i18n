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
      if (isArray(src[key])) {
        // replace with src[key] when:
        // src[key] is not an array
        for (let i = 0; i < src[key].length; i++) {
          if (!des[key]) des[key] = []
          if (isObject(src[key][i])) {
            des[key][i] = Object.assign(
              src[key] ? src[key][i] || {} : {},
              des[key] ? des[key][i] ?? {} : {}
            )
          } else {
            des[key][i] = src[key][i]
          }
        }
      } else if (isNotObjectOrIsArray(src[key])) {
        // replace with src[key] when:
        // src[key] is not an object, or
        des[key] = src[key]
      } else {
        if (!des[key]) des[key] = {}
        // src[key] and des[key] are both objects, merge them
        deepCopy(src[key], des[key])
      }
    }
  }
}

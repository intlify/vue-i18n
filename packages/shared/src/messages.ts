import { create, isArray, isObject } from './utils'

const isNotObjectOrIsArray = (val: unknown) => !isObject(val) || isArray(val)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepCopy(src: any, des: any): void {
  // src and des should both be objects, and none of them can be a array
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error('Invalid value')
  }

  const stack = [{ src, des }]
  while (stack.length) {
    const { src, des } = stack.pop()!

    // using `Object.keys` which skips prototype properties
    Object.keys(src).forEach(key => {
      if (key === '__proto__') {
        return
      }
      // if src[key] is an object/array, set des[key]
      // to empty object/array to prevent setting by reference
      if (isObject(src[key]) && !isObject(des[key])) {
        des[key] = Array.isArray(src[key]) ? [] : create()
      }

      if (isNotObjectOrIsArray(des[key]) || isNotObjectOrIsArray(src[key])) {
        // replace with src[key] when:
        // src[key] or des[key] is not an object, or
        // src[key] or des[key] is an array
        des[key] = src[key]
      } else {
        // src[key] and des[key] are both objects, merge them
        stack.push({ src: src[key], des: des[key] })
      }
    })
  }
}

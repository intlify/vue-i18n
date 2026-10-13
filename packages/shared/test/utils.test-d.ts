import { isKeylessObject } from '../src/utils'

describe('isKeylessObject', () => {
  test('narrows to an object without keys', () => {
    const value: Record<string, unknown> = {}
    if (isKeylessObject(value)) {
      expectTypeOf(value).toExtend<Record<string, never>>()
    }
  })

  test('accepts objects typed with an interface', () => {
    const options: Intl.NumberFormatOptions = {}
    expectTypeOf(isKeylessObject(options)).toEqualTypeOf<boolean>()
  })

  test('rejects arrays', () => {
    // @ts-expect-error -- arrays are not objects with keys to check
    isKeylessObject([])
    // @ts-expect-error -- readonly arrays too
    isKeylessObject([] as readonly unknown[])
  })
})

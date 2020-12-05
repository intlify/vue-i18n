import { isObject } from '@intlify/shared'

export type Foo = 'Foo'

console.log('hello compiler!', isObject({}))

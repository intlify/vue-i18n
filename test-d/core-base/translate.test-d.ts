/* eslint-disable @typescript-eslint/no-explicit-any */
import { expectType } from '../index'

import { createCoreContext } from '../../packages/core-base/src/context'
import { translate } from '../../packages/core-base/src/translate'

const ctx = createCoreContext({
  locale: 'en',
  messages: {
    en: {
      hello: 'hello world!'
    }
  }
})

expectType<string | number>(translate(ctx, 'hello'))
expectType<string | number>(translate(ctx, 'hello', 1))
expectType<string | number>(
  translate(ctx, 'hello', 1, { locale: 'en', missingWarn: true })
)
expectType<string | number>(translate(ctx, 'hello', 'default msg'))
expectType<string | number>(
  translate(ctx, 'hello', 'default msg', { locale: 'en', plural: 2 })
)
expectType<string | number>(translate(ctx, 'hello', ['list']))
expectType<string | number>(translate(ctx, 'hello', ['list'], 1))
expectType<string | number>(translate(ctx, 'hello', ['list'], 'default msg'))
expectType<string | number>(translate(ctx, 'hello', ['list'], { locale: 'en' }))
expectType<string | number>(translate(ctx, 'hello', { name: 'dio' }))
expectType<string | number>(translate(ctx, 'hello', { name: 'dio' }, 1))
expectType<string | number>(
  translate(ctx, 'hello', { name: 'dio' }, 'default msg')
)
expectType<string | number>(
  translate(
    ctx,
    'hello',
    { name: 'dio' },
    { locale: 'en', resolvedMessage: true }
  )
)

/* eslint-enable @typescript-eslint/no-explicit-any */

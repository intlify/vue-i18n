import { expectType } from '../index'

import { createCoreContext } from '../../packages/core-base/src'
import { translate } from '../../packages/core-base/src'

const ctx = createCoreContext({
  locale: 'en',
  messages: {
    en: {
      hello: 'hello world!',
      nest: {
        world: 'hello nest world!'
      }
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
expectType<string | number>(translate(ctx, 'nest.world'))

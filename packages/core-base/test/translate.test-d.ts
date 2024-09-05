import { createCoreContext, translate } from '../src'

test('translate type check', () => {
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

  expectTypeOf(translate(ctx, 'hello')).toEqualTypeOf<string | number>()
  expectTypeOf(translate(ctx, 'hello', 1)).toEqualTypeOf<string | number>()
  expectTypeOf(
    translate(ctx, 'hello', 1, { locale: 'en', missingWarn: true })
  ).toEqualTypeOf<string | number>()
  expectTypeOf(translate(ctx, 'hello', 'default msg')).toEqualTypeOf<
    string | number
  >()
  expectTypeOf(
    translate(ctx, 'hello', 'default msg', { locale: 'en', plural: 2 })
  ).toEqualTypeOf<string | number>()
  expectTypeOf(translate(ctx, 'hello', ['list'])).toEqualTypeOf<
    string | number
  >()
  expectTypeOf(translate(ctx, 'hello', ['list'], 1)).toEqualTypeOf<
    string | number
  >()
  expectTypeOf(translate(ctx, 'hello', ['list'], 'default msg')).toEqualTypeOf<
    string | number
  >()
  expectTypeOf(
    translate(ctx, 'hello', ['list'], { locale: 'en' })
  ).toEqualTypeOf<string | number>()
  expectTypeOf(translate(ctx, 'hello', { name: 'dio' })).toEqualTypeOf<
    string | number
  >()
  expectTypeOf(translate(ctx, 'hello', { name: 'dio' }, 1)).toEqualTypeOf<
    string | number
  >()
  expectTypeOf(
    translate(ctx, 'hello', { name: 'dio' }, 'default msg')
  ).toEqualTypeOf<string | number>()
  expectTypeOf(
    translate(
      ctx,
      'hello',
      { name: 'dio' },
      { locale: 'en', resolvedMessage: true }
    )
  ).toEqualTypeOf<string | number>()
  expectTypeOf(translate(ctx, 'nest.world')).toEqualTypeOf<string | number>()
})

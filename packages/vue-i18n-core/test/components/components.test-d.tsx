import 'vue/jsx'
import { DatetimeFormat, NumberFormat, Translation } from '../../src/components'

test('components type check', () => {
  // @ts-expect-error missing keypath
  expectTypeOf(<Translation />).toEqualTypeOf<JSX.Element>()
  // @ts-expect-error invalid props
  expectTypeOf(<Translation keypath={1} />).toEqualTypeOf<JSX.Element>()

  expectTypeOf(
    <Translation tag="span" keypath={'foo.bar'} />
  ).toEqualTypeOf<JSX.Element>()
  expectTypeOf(
    <NumberFormat format={'foo.bar'} value={1000} />
  ).toEqualTypeOf<JSX.Element>()
  expectTypeOf(
    <DatetimeFormat format={'foo.bar'} value={new Date().getTime()} />
  ).toEqualTypeOf<JSX.Element>()
})

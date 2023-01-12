import { expectType, expectError } from '..'

import {
  Translation,
  NumberFormat,
  DatetimeFormat
} from '../../packages/vue-i18n-core/src/components'

// @ts-expect-error missing keypath
expectError(<Translation />)
// @ts-expect-error invalid props
expectError(<Translation keypath={1} />)

expectType<JSX.Element>(<Translation tag="span" keypath={'foo.bar'} />)

expectType<JSX.Element>(<NumberFormat format={'foo.bar'} value={1000} />)
expectType<JSX.Element>(
  <DatetimeFormat format={'foo.bar'} value={new Date().getTime()} />
)

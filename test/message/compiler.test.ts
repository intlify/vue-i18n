import { compile } from '../../src/message/compiler'

/* eslint-disable no-irregular-whitespace */
test(`@.caml:{'no apples'} | {0} apple | {n}　apples`, () => {
  const code = compile(`@.caml:{'no apples'} | {0} apple | {n}　apples`)
  expect(code.toString()).toMatchSnapshot('code')
})
/* eslint-enable no-irregular-whitespace */

describe('edge cases', () => {
  test(` | | | `, () => {
    const code = compile(` | | | `, {
      onError(error) {
        expect({ ...error, message: error.message }).toMatchSnapshot('error')
      }
    })
    expect(code.toString()).toMatchSnapshot('code')
  })
})

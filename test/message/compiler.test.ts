/* eslint-disable @typescript-eslint/no-empty-function, no-irregular-whitespace */

// utils
jest.mock('../../src/utils', () => ({
  ...jest.requireActual<object>('../../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../../src/utils'

import { compile } from '../../src/message/compiler'

test(`@.caml:{'no apples'} | {0} apple | {n}　apples`, () => {
  const code = compile(`@.caml:{'no apples'} | {0} apple | {n}　apples`)
  expect(code.toString()).toMatchSnapshot('code')
})

describe('warnHtmlMessage', () => {
  test('default', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})

    const code = compile('<p>hello</p>')
    expect(code.toString()).toMatchSnapshot('code')
    expect(mockWarn).toHaveBeenCalled()
    expect(mockWarn.mock.calls[0][0]).toEqual(
      `Detected HTML in '<p>hello</p>' message. Recommend not using HTML messages to avoid XSS.`
    )
  })

  test('false', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})

    const code = compile('<p>hello</p>', { warnHtmlMessage: false })
    expect(code.toString()).toMatchSnapshot('code')
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

describe('edge cases', () => {
  test(` | | | `, () => {
    const code = compile(` | | | `, {
      onError(error) {
        expect({ ...error, message: error.message }).toMatchSnapshot('error')
      }
    })
    expect(code.toString()).toMatchSnapshot('code')
  })

  test(`hi %s !`, () => {
    const code = compile(`hi %s !`)
    expect(code.toString()).toMatchSnapshot('code')
  })

  test(`%`, () => {
    const code = compile(`%`)
    expect(code.toString()).toMatchSnapshot('code')
  })

  test(`no apples %| one apple % |  too much apples  `, () => {
    const code = compile(`no apples %| one apple % |  too much apples  `)
    expect(code.toString()).toMatchSnapshot('code')
  })
})

/* eslint-enable @typescript-eslint/no-empty-function, no-irregular-whitespace  */

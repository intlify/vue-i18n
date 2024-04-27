import { CoreErrorCodes } from '../src/errors'

test('CoreErrorCodes', () => {
  expect(CoreErrorCodes.__EXTEND_POINT__).toBe(24)
})

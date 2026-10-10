import { CORE_WARN_CODES_EXTEND_POINT, CoreWarnCodes } from '../src/warnings'

test('CoreWarnCodes', () => {
  expect(CORE_WARN_CODES_EXTEND_POINT).toBe(11)
  // the extend point is the first code that core-base does not use
  expect(Math.max(...Object.values(CoreWarnCodes))).toBe(CORE_WARN_CODES_EXTEND_POINT - 1)
})

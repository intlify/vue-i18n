// utils
jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../../src/utils'

import { createRuntimeContext as context, datetime } from '../../src/runtime'

test.todo('datetime')

// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn()
  }
})
import { handleFlatJson } from '../src/utils'
import { I18nWarnCodes, getWarnMessage } from '../src/warnings'

test('handleFlatJson', () => {
  const mockWarn = vi.spyOn(shared, 'warn')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mockWarn.mockImplementation(() => {})

  const obj = {
    a: { a1: 'a1.value' },
    'a.a2': 'a.a2.value',
    'b.x': {
      'b1.x': 'b1.x.value',
      'b2.x': ['b2.x.value0', 'b2.x.value1'],
      'b3.x': { 'b3.x': 'b3.x.value' }
    },
    c: {
      'animal.dog': 'Dog',
      animal: 'Animal'
    },
    d: {
      'animal.dog': 'Dog',
      animal: {}
    }
  }
  const expectObj = {
    a: {
      a1: 'a1.value',
      a2: 'a.a2.value'
    },
    b: {
      x: {
        b1: { x: 'b1.x.value' },
        b2: { x: ['b2.x.value0', 'b2.x.value1'] },
        b3: { x: { b3: { x: 'b3.x.value' } } }
      }
    },
    c: {
      'animal.dog': 'Dog',
      animal: 'Animal'
    },
    d: {
      animal: {
        dog: 'Dog'
      }
    }
  }

  expect(handleFlatJson(obj)).toEqual(expectObj)
  expect(mockWarn).toHaveBeenCalled()
  expect(mockWarn.mock.calls[0][0]).toEqual(
    getWarnMessage(I18nWarnCodes.IGNORE_OBJ_FLATTEN, {
      key: 'animal'
    })
  )
})

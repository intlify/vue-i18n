import { handleFlatJson } from '../src/utils'

test('handleFlatJson', () => {
  const obj = {
    a: { a1: 'a1.value' },
    'a.a2': 'a.a2.value',
    'b.x': {
      'b1.x': 'b1.x.value',
      'b2.x': ['b2.x.value0', 'b2.x.value1'],
      'b3.x': { 'b3.x': 'b3.x.value' }
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
    }
  }
  expect(handleFlatJson(obj)).toEqual(expectObj)
})

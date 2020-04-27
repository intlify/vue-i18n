import { generateCodeFrame } from '../src/utils'

test('generateCodeFrame', () => {
  const source = `hi, { 'kazupon' }`.trim()
  const keyStart = source.indexOf(`{ 'kazupon' }`)
  const keyEnd = keyStart + `{ 'kazupon' }`.length
  expect(generateCodeFrame(source, keyStart, keyEnd)).toMatchSnapshot()
})

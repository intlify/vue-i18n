import fs from 'node:fs/promises'
import path from 'node:path'

test('replace', async () => {
  const source = await fs.readFile(
    path.resolve(__dirname, './fixtures/message-compiler.d.ts'),
    'utf-8'
  )

  const RE_TRIPLE_SLASH_REFERENCE = /\/\/\/ <reference types="([^"]*)" \/>/
  const i1 = RE_TRIPLE_SLASH_REFERENCE.exec(source)
  const index = i1?.index || -1
  const matchLength = i1?.[0].length || 0
  console.log('number', i1)
  const s = source
    .replace(RE_TRIPLE_SLASH_REFERENCE, ``)
    .replace(RE_TRIPLE_SLASH_REFERENCE, '')
  expect(s).toMatchSnapshot()
})

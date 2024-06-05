import path from 'node:path'
import { promises as fs } from 'node:fs'

const RE_TRIPLE_SLASH_REFERENCE = /\/\/\/ <reference types="([^"]*)" \/>/

function replaceTripleSlashReference(source: string) {
  return source
    .replace(RE_TRIPLE_SLASH_REFERENCE, ``)
    .replace(RE_TRIPLE_SLASH_REFERENCE, '')
}

async function replaceMessageCompiler() {
  let source = await fs.readFile(
    path.resolve(
      __dirname,
      '../packages/message-compiler/dist/message-compiler.d.ts'
    ),
    'utf8'
  )

  source = replaceTripleSlashReference(source)

  await fs.writeFile(
    path.resolve(
      __dirname,
      '../packages/message-compiler/dist/message-compiler.d.ts'
    ),
    source
  )
}

async function main() {
  await replaceMessageCompiler()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

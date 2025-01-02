import { spawnSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'
import { displaySize, sizeTargets } from './utils'

import type { BundleReport } from './utils'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const sizeDir = path.resolve(__dirname, '../temp/size')

async function main() {
  console.log('📏 Checking bundle sizes ...')
  console.log()
  const targets = await sizeTargets()
  const results: BundleReport[] = []
  for (const target of targets) {
    const root = path.resolve(__dirname, `../packages/${target}`)
    results.push(bundle(root))
  }

  for (const result of results) {
    console.log(
      `${pc.green(pc.bold(result.name))} - ` +
        `min: ${displaySize(result.size)} / ` +
        `gzip: ${displaySize(result.gzip)} / ` +
        `brotli: ${displaySize(result.brotli)}`
    )
  }

  await fs.mkdir(sizeDir, { recursive: true })
  await fs.writeFile(
    path.resolve(sizeDir, '_usages.json'),
    JSON.stringify(Object.fromEntries(results.map(r => [r.name, r])), null, 2),
    'utf-8'
  )
}

function bundle(target: string) {
  const orgDir = process.cwd()
  process.chdir(target)
  const result = spawnSync('node', ['scripts/size.mjs'])
  process.chdir(orgDir)
  return JSON.parse(result.stdout.toString()) as BundleReport
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

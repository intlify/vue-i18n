import { markdownTable } from 'markdown-table'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { displaySize } from './utils'

import type { BundleReport } from './utils'

type UsageReport = Record<string, BundleReport>

const currDir = path.resolve('temp/size')
const prevDir = path.resolve('temp/size-prev')
const sizeHeaders = ['Size', 'Gzip', 'Brotli']

async function rednerFiles(output: string) {
  const filterFiles = (files: string[]) =>
    files.filter(file => file[0] !== '_' && !file.endsWith('.txt'))

  const curr = filterFiles(await fs.readdir(currDir))
  const prev = existsSync(prevDir) ? filterFiles(await fs.readdir(prevDir)) : []
  const fileList = new Set([...curr, ...prev])

  const rows = []
  for (const file of fileList) {
    const currPath = path.resolve(currDir, file)
    const prevPath = path.resolve(prevDir, file)

    const curr = await importJSON(currPath)
    const prev = await importJSON(prevPath)
    const fileName = curr?.file || prev?.file || ''

    if (!curr) {
      rows.push([`~~${fileName}~~`])
    } else {
      rows.push([
        fileName,
        `${displaySize(curr.size)}${getDiff(curr.size, prev?.size)}`,
        `${displaySize(curr.gzip)}${getDiff(curr.gzip, prev?.gzip)}`,
        `${displaySize(curr.brotli)}${getDiff(curr.brotli, prev?.brotli)}`
      ])
    }
  }

  output += '### Bundles\n\n'
  output += markdownTable([['File', ...sizeHeaders], ...rows])
  output += '\n\n'

  return output
}

async function importJSON(filePath: string) {
  if (!existsSync(filePath)) {
    return undefined
  }
  return (await import(filePath, { assert: { type: 'json' } })).default
}

function getDiff(curr: number, prev: number) {
  if (prev === undefined) {
    return ''
  }
  const diff = curr - prev
  if (diff === 0) {
    return ''
  }
  const sign = diff > 0 ? '+' : ''
  return ` (**${sign}${displaySize(diff)}**)`
}

async function renderUsages(output: string) {
  const curr = (await importJSON(
    path.resolve(currDir, '_usages.json')
  )) as UsageReport
  const prev = (await importJSON(
    path.resolve(prevDir, '_usages.json')
  )) as UsageReport

  output += '\n### Usages\n\n'

  const data = Object.values(curr)
    .map(usage => {
      const prevUsage = prev?.[usage.name]
      const diffSize = getDiff(usage.size, prevUsage?.size)
      const diffGzipped = getDiff(usage.gzip, prevUsage?.gzip)
      const diffBrotli = getDiff(usage.brotli, prevUsage?.brotli)

      return [
        usage.name,
        `${displaySize(usage.size)}${diffSize}`,
        `${displaySize(usage.gzip)}${diffGzipped}`,
        `${displaySize(usage.brotli)}${diffBrotli}`
      ]
    })
    .filter(usage => !!usage)

  output += `${markdownTable([['Name', ...sizeHeaders], ...data])}\n\n`

  return output
}

async function main() {
  let output = '## Size Report\n\n'
  output = await rednerFiles(output)
  output = await renderUsages(output)
  process.stdout.write(output)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

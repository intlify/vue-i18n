import fs from 'node:fs/promises'
import { parseArgs as _parseArgs } from 'node:util'

export async function readJson(path) {
  const data = await fs.readFile(path, 'utf8')
  return JSON.parse(data)
}

const numberFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2
})

function displaySize(bytes) {
  return `${numberFormatter.format(bytes / 1000)} kB`
}

export function displayMemoryUsage() {
  const heap = process.memoryUsage()
  const msg = []
  for (const key in heap) {
    msg.push(`${key}: ${displaySize(heap[key])}`)
  }
  console.log()
  console.log('memory usage:', msg.join(', '))
}

export function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    format: {
      type: 'string',
      short: 'f'
    }
  }
  const { values } = _parseArgs({ args, options })
  if (values.format == null) {
    values.format = 'mitata'
  }
  return values
}

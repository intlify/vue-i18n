import fs from 'node:fs/promises'

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

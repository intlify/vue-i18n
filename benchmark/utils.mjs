import fs from 'fs/promises'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function readJson(path) {
  const data = await fs.readFile(path, 'utf8')
  return JSON.parse(data)
}

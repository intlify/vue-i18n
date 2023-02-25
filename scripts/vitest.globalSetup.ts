import { fileURLToPath } from 'node:url'
import { URL } from 'node:url'

// @ts-ignore
import serveStatic from 'serve-static'
import { listen } from 'listhen'

const __dirname = fileURLToPath(new URL('..', import.meta.url))

export async function setup() {
  const listener = await listen(serveStatic(__dirname), { port: 8080 })
  return async () => {
    await listener.close()
  }
}

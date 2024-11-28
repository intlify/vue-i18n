import { fileURLToPath, URL } from 'node:url'

import { listen } from 'listhen'
import handler from 'serve-handler'

const __dirname = fileURLToPath(new URL('..', import.meta.url))

export async function setup() {
  const listener = await listen(
    (req, res) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handler(req, res, { public: __dirname })
    },
    { port: 8080 }
  )
  return async () => {
    await listener.close()
  }
}

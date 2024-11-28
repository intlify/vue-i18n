import { getRandomPort } from 'get-port-please'
import { fileURLToPath, URL } from 'node:url'

import { listen } from 'listhen'
import handler from 'serve-handler'
import { exposeContextToEnv, setTestContext } from './test-utils'

const __dirname = fileURLToPath(new URL('..', import.meta.url))

export async function setup() {
  const host = '127.0.0.1'
  const port = await getRandomPort(host)
  const url = `http://${host}:${port}`

  setTestContext({ url })
  exposeContextToEnv()

  const listener = await listen(
    (req, res) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handler(req, res, { public: __dirname })
    },
    { port, hostname: host }
  )

  return async () => {
    await listener.close()
  }
}

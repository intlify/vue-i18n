import { createServer } from 'node:http'
import {
  createApp,
  eventHandler,
  createRouter,
  toNodeListener,
  setHeaders
} from 'h3'

const app = createApp()
const router = createRouter()
router.get(
  '/api/resources/:locale',
  eventHandler(async event => {
    const locale = event.context.params?.locale ?? 'en'
    const data = await import(`../db/${locale}.json`)
    setHeaders(event, {
      'Access-Control-Allow-Origin': '*'
    })
    return data
  })
)
app.use(router)

createServer(toNodeListener(app)).listen(process.env.PORT || 3000)

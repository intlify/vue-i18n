/**
 * for E2E test server
 */

import path from 'pathe'
import { default as httpServer } from 'http-server'

const server = httpServer.createServer({
  root: path.resolve(path.dirname('.'), './')
})

server.listen(8080)

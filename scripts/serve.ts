/**
 * for E2E test server
 */

import path from 'path'
import { default as httpServer } from 'http-server'

const server = httpServer.createServer({
  root: path.resolve(__dirname, '../')
})

server.listen(8080)

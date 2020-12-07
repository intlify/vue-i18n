'use strict'
const path = require('path')
const httpServer = require('http-server')
const server = httpServer.createServer({
  root: path.resolve(__dirname, '../')
})

server.listen(8080)

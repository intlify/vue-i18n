'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/devtools-if.prod.cjs')
} else {
  module.exports = require('./dist/devtools-if.cjs')
}

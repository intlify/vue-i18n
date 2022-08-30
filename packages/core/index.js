'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/core.prod.cjs')
} else {
  module.exports = require('./dist/core.cjs')
}

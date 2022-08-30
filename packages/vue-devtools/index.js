'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vue-devtools.prod.cjs')
} else {
  module.exports = require('./dist/vue-devtools.cjs')
}

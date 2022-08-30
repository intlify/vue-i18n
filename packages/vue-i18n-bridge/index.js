'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vue-i18n-bridge.prod.cjs')
} else {
  module.exports = require('./dist/vue-i18n-bridge.cjs')
}

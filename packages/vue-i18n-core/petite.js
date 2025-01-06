'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/petite-vue-i18n-core.prod.cjs')
} else {
  module.exports = require('./dist/petite-vue-i18n-core.cjs')
}

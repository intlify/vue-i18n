import {
  createCoreContext,
  translate
} from '../../core/dist/core.runtime.esm-bundler.js'

const ctx = createCoreContext({
  locale: 'en',
  messages: {
    en: {
      hello: 'hello!'
    }
  }
})

console.log(translate(ctx, 'hello'))

import { createCoreContext, translate } from '@intlify/core'

const ctx = createCoreContext({
  locale: 'en',
  messages: {
    en: {
      hello: 'hello!'
    }
  }
})

console.log(translate(ctx, 'hello'))

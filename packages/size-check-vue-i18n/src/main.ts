import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

const ast = {
  type: 0,
  start: 0,
  end: 6,
  loc: {
    start: {
      line: 1,
      column: 1,
      offset: 0
    },
    end: {
      line: 1,
      column: 7,
      offset: 6
    },
    source: 'hello!'
  },
  body: {
    type: 2,
    start: 0,
    end: 6,
    loc: {
      start: {
        line: 1,
        column: 1,
        offset: 0
      },
      end: {
        line: 1,
        column: 7,
        offset: 6
      }
    },
    items: [
      {
        type: 3,
        start: 0,
        end: 6,
        loc: {
          start: {
            line: 1,
            column: 1,
            offset: 0
          },
          end: {
            line: 1,
            column: 7,
            offset: 6
          }
        },
        value: 'hello!'
      }
    ],
    static: 'hello!'
  },
  cacheKey: '{"l":"en","k":"hello","s":"hello!"}'
}

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      hello: ast // 'hello!'
    }
  }
})

const app = createApp(App)
app.use(i18n, { globalInstall: false })
console.log('t', i18n.global.t('hello'))
app.mount('#app')

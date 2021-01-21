/**
 * @jest-environment jsdom
 */

import {
  defineComponent,
  nextTick,
  getCurrentInstance,
  ComponentOptions
} from 'vue'
import { mount } from './helper'
import { createI18n, useI18n } from '../src/index'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { Composer } from '../src/composer'

describe('createI18n', () => {
  test('legacy mode', () => {
    const i18n = createI18n({})

    expect(i18n.mode).toEqual('legacy')
  })

  test('composition mode', () => {
    const i18n = createI18n({
      legacy: false
    })

    expect(i18n.mode).toEqual('composition')
  })
})

describe('useI18n', () => {
  let org: any // eslint-disable-line @typescript-eslint/no-explicit-any
  let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
  beforeEach(() => {
    org = console.warn
    spy = jest.fn()
    console.warn = spy
  })
  afterEach(() => {
    console.warn = org
  })

  test('basic', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      setup() {
        composer = useI18n({
          inheritLocale: false,
          locale: 'en',
          messages: {
            en: {
              hello: 'hello!'
            }
          }
        })
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)

    expect(i18n.global !== composer).toEqual(true)
    expect((composer as Composer).locale.value).toEqual('en')
  })

  test('global scope', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      setup() {
        composer = useI18n({ useScope: 'global' })
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)

    expect(i18n.global === composer).toEqual(true)
    expect((composer as Composer).locale.value).toEqual('ja')
  })

  test('parent scope', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let leaf: unknown
    let parent: unknown
    const App = defineComponent({
      components: {
        Leaf: {
          template: '<p>local</p>',
          setup() {
            leaf = useI18n({ useScope: 'parent' })
            return {}
          }
        }
      },
      setup() {
        parent = useI18n({
          inheritLocale: false,
          locale: 'en',
          messages: {
            en: {
              hello: 'hello!'
            }
          }
        })
        return {}
      },
      template: `<div>parent</div><Leaf />`
    })
    await mount(App, i18n)

    expect(i18n.global !== leaf).toEqual(true)
    expect(i18n.global !== parent).toEqual(true)
    expect(parent === leaf).toEqual(true)
    expect((leaf as Composer).locale.value).toEqual('en')
  })

  test('not found parent composer with parent scope', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      components: {
        Leaf: {
          template: '<p>local</p>',
          setup() {
            composer = useI18n({ useScope: 'parent' })
            return {}
          }
        }
      },
      setup() {
        return {}
      },
      template: `<div>parent</div><Leaf />`
    })
    await mount(App, i18n)

    expect(i18n.global === composer).toEqual(true)
    expect((composer as Composer).locale.value).toEqual('ja')
  })

  test('empty options', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      setup() {
        composer = useI18n()
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)

    expect(i18n.global === composer).toEqual(true)
    expect((composer as Composer).locale.value).toEqual('ja')
  })

  test('empty options, when have i18n custom blocks', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      setup() {
        const instance = getCurrentInstance()
        if (instance == null) {
          throw new Error()
        }
        const options = instance.type as ComponentOptions
        options.__i18n = [
          {
            locale: '',
            resource: { en: { hello: 'Hello,world!' } }
          },
          {
            locale: '',
            resource: { ja: { hello: 'こんにちは、世界！' } }
          }
        ]
        composer = useI18n()
        return { t: (composer as Composer).t }
      },
      template: `<p>{{ t('hello', ['foo'], { locale: 'ja' }) }}</p>`
    })
    const { html } = await mount(App, i18n)

    expect(html()).toEqual('<p>こんにちは、世界！</p>')
    expect(i18n.global !== composer).toEqual(true)
    expect((composer as Composer).locale.value).toEqual('ja')
  })

  test(errorMessages[I18nErrorCodes.MUST_BE_CALL_SETUP_TOP], async () => {
    let error = ''
    try {
      useI18n({})
    } catch (e) {
      error = e.message
    }
    expect(error).toEqual(errorMessages[I18nErrorCodes.MUST_BE_CALL_SETUP_TOP])
  })

  test(errorMessages[I18nErrorCodes.NOT_INSLALLED], async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let error = ''
    const App = defineComponent({
      setup() {
        try {
          useI18n({})
        } catch (e) {
          error = e.message
        }
        return {}
      }
    })
    await mount(App, i18n, { installI18n: false })
    expect(error).toEqual(errorMessages[I18nErrorCodes.NOT_INSLALLED])
  })

  test(errorMessages[I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE], async () => {
    const i18n = createI18n({
      legacy: true,
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let error = ''
    const App = defineComponent({
      setup() {
        try {
          useI18n({
            locale: 'en',
            messages: {
              en: {
                hello: 'hello!'
              }
            }
          })
        } catch (e) {
          error = e.message
        }
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)
    expect(error).toEqual(
      errorMessages[I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE]
    )
  })
})

describe('slot reactivity', () => {
  let org: any // eslint-disable-line @typescript-eslint/no-explicit-any
  let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
  beforeEach(() => {
    org = console.warn
    spy = jest.fn()
    console.warn = spy
  })
  afterEach(() => {
    console.warn = org
  })

  test('legacy', async () => {
    const i18n = createI18n({
      locale: 'ja',
      fallbackLocale: ['en'],
      messages: {
        en: {
          hello: 'hello!'
        },
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    const SlotChild = {
      template: `<p><slot/></p>`
    }

    const SubChild = {
      template: `
        <div class="sub-child">
          <h1>Sub Child</h1>
          <form>
            <select v-model="$i18n.locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ $t('hello') }}</p>
        </div>
      `
    }

    const Child = {
      components: {
        SubChild,
        SlotChild
      },
      template: `
        <div class="child">
          <h1>Child</h1>
          <form>
            <select v-model="$i18n.locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ $t('hello') }}</p>
          <SubChild />
          $t inside of slot
          <SlotChild>
            {{ $t('hello') }}
          </SlotChild>
          i18n-t inside of slot
          <SlotChild>
            <i18n-t keypath='hello'/>
          </SlotChild>
        </div>
      `
    }

    const App = defineComponent({
      components: {
        Child
      },
      template: `
        <h1>Root</h1>
          <form>
            <select v-model="$i18n.locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ $t('hello') }}</p>
        <Child />
      `
    })
    const { html } = await mount(App, i18n)
    expect(html()).toMatchSnapshot('ja')
    i18n.global.locale = 'en'
    await nextTick()
    expect(html()).toMatchSnapshot('en')
  })

  test('composable', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'ja',
      fallbackLocale: ['en'],
      messages: {
        en: {
          hello: 'hello!'
        },
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    const SlotChild = {
      template: `<p><slot/></p>`
    }

    const SubChild = {
      template: `
        <div class="sub-child">
          <h1>Sub Child</h1>
          <form>
            <select v-model="locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ t('hello') }}</p>
        </div>
      `,
      setup() {
        return useI18n()
      }
    }

    const Child = {
      components: {
        SubChild,
        SlotChild
      },
      template: `
        <div class="child">
          <h1>Child</h1>
          <form>
            <select v-model="locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ t('hello') }}</p>
          <SubChild />
          t inside of slot
          <SlotChild>
            {{ t('hello') }}
          </SlotChild>
          i18n-t inside of slot
          <SlotChild>
            <i18n-t keypath='hello'/>
          </SlotChild>
        </div>
      `,
      setup() {
        return useI18n()
      }
    }

    const App = defineComponent({
      components: {
        Child
      },
      setup() {
        return useI18n()
      },
      template: `
        <h1>Root</h1>
          <form>
            <select v-model="locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ t('hello') }}</p>
        <Child />
      `
    })
    const { html } = await mount(App, i18n)
    expect(html()).toMatchSnapshot('ja')
    i18n.global.locale.value = 'en'
    await nextTick()
    expect(html()).toMatchSnapshot('en')
  })
})

test('multi instance', async () => {
  const i18n1 = createI18n({
    legacy: false,
    locale: 'ja',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })
  const i18n2 = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      ja: {
        hello: 'こんにちは！'
      }
    }
  })

  const App = defineComponent({
    setup() {
      const i18n = useI18n({
        locale: 'en',
        messages: {
          en: {
            hello: 'hello!'
          }
        }
      })
      return { ...i18n }
    },
    template: `<p>foo</p>`
  })
  const { app: app1 } = await mount(App, i18n1)
  const { app: app2 } = await mount(App, i18n2)

  expect(app1.__VUE_I18N_SYMBOL__ !== app2.__VUE_I18N_SYMBOL__).toEqual(true)
  expect(i18n1.global).not.toEqual(i18n2.global)
})

test('merge useI18n resources to global scope', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ja',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })

  const App = defineComponent({
    setup() {
      useI18n({
        useScope: 'global',
        messages: {
          ja: {
            hello: 'こんにちは！'
          }
        },
        datetimeFormats: {
          'en-US': {
            short: {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }
          }
        },
        numberFormats: {
          'en-US': {
            currency: {
              style: 'currency',
              currency: 'USD',
              currencyDisplay: 'symbol'
            }
          }
        }
      })
      return {}
    },
    template: `<p>foo</p>`
  })
  await mount(App, i18n)

  expect(i18n.global.getLocaleMessage('ja')).toEqual({ hello: 'こんにちは！' })
  expect(i18n.global.getDateTimeFormat('en-US')).toEqual({
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
  })
  expect(i18n.global.getNumberFormat('en-US')).toEqual({
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    }
  })
})

test('merge i18n custom blocks to global scope', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ja',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })

  const App = defineComponent({
    setup() {
      const instance = getCurrentInstance()
      if (instance == null) {
        throw new Error()
      }
      const options = instance.type as ComponentOptions
      options.__i18nGlobal = [
        {
          locale: 'en',
          resource: { foo: 'foo!' }
        },
        {
          locale: 'ja',
          resource: { foo: 'ふー！' }
        }
      ]
      useI18n({
        useScope: 'global',
        messages: {
          ja: {
            hello: 'こんにちは！'
          }
        }
      })
      return {}
    },
    template: `<p>foo</p>`
  })
  await mount(App, i18n)

  expect(i18n.global.getLocaleMessage('en')).toEqual({
    hello: 'hello!',
    foo: 'foo!'
  })
  expect(i18n.global.getLocaleMessage('ja')).toEqual({
    hello: 'こんにちは！',
    foo: 'ふー！'
  })
})

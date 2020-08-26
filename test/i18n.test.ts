/**
 * @jest-environment jsdom
 */

import { defineComponent, nextTick } from 'vue'
import { mount } from './helper'
import { createI18n, useI18n } from '../src/i18n'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { Composer } from '../src/composer'

describe('createI18n', () => {
  test('legay mode', () => {
    const i18n = createI18n({
      legacy: true
    })

    expect(i18n.mode).toEqual('legacy')
  })

  test('composable mode', () => {
    const i18n = createI18n({})

    expect(i18n.mode).toEqual('composable')
  })
})

describe('useI18n', () => {
  let org, spy
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
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: Composer | null = null
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
    expect(composer.locale.value).toEqual('en')
  })

  test('global scope', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: Composer | null = null
    const App = defineComponent({
      setup() {
        composer = useI18n({ useScope: 'global' })
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)

    expect(i18n.global === composer).toEqual(true)
    expect(composer.locale.value).toEqual('ja')
  })

  test('parent scope', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let leaf: Composer | null = null
    let parent: Composer | null = null
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
    expect(leaf.locale.value).toEqual('en')
  })

  test('not found parent composer with parent scope', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: Composer | null = null
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
    expect(composer.locale.value).toEqual('ja')
  })

  test('empty options', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: Composer | null = null
    const App = defineComponent({
      setup() {
        composer = useI18n()
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)

    expect(i18n.global === composer).toEqual(true)
    expect(composer.locale.value).toEqual('ja')
  })

  test(errorMessages[I18nErrorCodes.NOT_INSLALLED], () => {
    expect(() => {
      useI18n()
    }).toThrowError(errorMessages[I18nErrorCodes.NOT_INSLALLED])
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
  let org, spy
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
      legacy: true,
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
    i18n.global.locale.value = 'en'
    await nextTick()
    expect(html()).toMatchSnapshot('en')
  })

  test('compsable', async () => {
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

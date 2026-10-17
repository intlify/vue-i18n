/**
 * @vitest-environment jsdom
 */

// utils
const timing = vi.hoisted(() => ({ available: true, mark: vi.fn(), measure: vi.fn() }))
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    // `@intlify/shared` leaves them undefined without the User Timing API, as in the jsdom environment of Jest
    get mark() {
      return timing.available ? timing.mark : undefined
    },
    get measure() {
      return timing.available ? timing.measure : undefined
    }
  }
})

import { createEmitter } from '@intlify/shared'
import { compile } from '../src/compilation'
import { createCoreContext } from '../src/context'
import { translate } from '../src/translate'

import type { VueDevToolsEmitterEvents } from '@intlify/devtools-types'
import type { WildcardEventHandler } from '@intlify/shared'
import type { CoreInternalContext } from '../src/context'

afterEach(() => {
  timing.available = true
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

function setup(devtools: boolean) {
  const context = createCoreContext({
    locale: 'en',
    messageCompiler: compile,
    messages: { en: { hello: 'Hello {name}!' } }
  })
  const events: (keyof VueDevToolsEmitterEvents)[] = []
  if (devtools) {
    const emitter = createEmitter<VueDevToolsEmitterEvents>()
    const onEvent: WildcardEventHandler<VueDevToolsEmitterEvents> = event => {
      events.push(event)
    }
    emitter.on('*', onEvent)
    // the composer of vue-i18n sets the emitter in the same way, when the devtools are enabled
    ;(context as unknown as CoreInternalContext).__v_emitter = emitter
  }
  return { context, events }
}

test('does not measure the timeline without the devtools emitter', () => {
  const now = vi.spyOn(window.performance, 'now')
  const { context } = setup(false)

  expect(translate(context, 'hello', { name: 'DIO' })).toEqual('Hello DIO!')
  expect(now).not.toHaveBeenCalled()
  expect(timing.mark).not.toHaveBeenCalled()
  expect(timing.measure).not.toHaveBeenCalled()
})

test('measures the timeline with the devtools emitter', () => {
  const { context, events } = setup(true)

  expect(translate(context, 'hello', { name: 'DIO' })).toEqual('Hello DIO!')
  expect(events).toEqual(['message-resolve', 'message-compilation', 'message-evaluation'])
  expect(timing.mark.mock.calls.flat()).toEqual([
    'intlify-message-resolve-start',
    'intlify-message-resolve-end',
    'intlify-message-compilation-start',
    'intlify-message-compilation-end',
    'intlify-message-evaluation-start',
    'intlify-message-evaluation-end'
  ])
  expect(timing.measure.mock.calls).toEqual([
    ['intlify message resolve', 'intlify-message-resolve-start', 'intlify-message-resolve-end'],
    [
      'intlify message compilation',
      'intlify-message-compilation-start',
      'intlify-message-compilation-end'
    ],
    [
      'intlify message evaluation',
      'intlify-message-evaluation-start',
      'intlify-message-evaluation-end'
    ]
  ])
})

test('measures the timeline without the User Timing API', () => {
  timing.available = false
  const { context, events } = setup(true)

  expect(translate(context, 'hello', { name: 'DIO' })).toEqual('Hello DIO!')
  expect(events).toEqual(['message-resolve', 'message-compilation', 'message-evaluation'])
})

/**
 * @vitest-environment jsdom
 */

import { createEmitter } from '@intlify/shared'
import { createCoreContext, translate } from '../src'
import { compile } from '../src/compilation'

import type { IntlifyDevToolsEmitterHooks } from '@intlify/devtools-types'

afterEach(() => {
  vi.restoreAllMocks()
})

test('does not measure translation timeline without devtools emitter', () => {
  const now = vi.spyOn(window.performance, 'now')
  const ctx = createCoreContext({
    locale: 'en',
    messageCompiler: compile,
    messages: {
      en: {
        hello: 'Hello {name}!'
      }
    }
  })

  expect(translate(ctx, 'hello', { name: 'DIO' })).toEqual('Hello DIO!')
  expect(now).not.toHaveBeenCalled()
})

test('measures translation timeline with devtools emitter', () => {
  let timestamp = 0
  const now = vi
    .spyOn(window.performance, 'now')
    .mockImplementation(() => ++timestamp)
  const emitter = createEmitter<IntlifyDevToolsEmitterHooks>()
  const events: string[] = []
  // @ts-ignore -- for testing purposes, we ignore the type error of the emitter
  emitter.on('*', type => {
    events.push(type)
  })

  const ctx = createCoreContext({
    locale: 'en',
    messageCompiler: compile,
    messages: {
      en: {
        hello: 'Hi {name}!'
      }
    },
    __v_emitter: emitter
  })

  expect(translate(ctx, 'hello', { name: 'DIO' })).toEqual('Hi DIO!')
  expect(now).toHaveBeenCalled()
  expect(events).toContain('message-resolve')
  expect(events).toContain('message-compilation')
  expect(events).toContain('message-evaluation')
})

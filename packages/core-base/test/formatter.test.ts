import { createEmitter } from '@intlify/shared'

import { createCoreContext } from '../src/context'
import { clearDateTimeFormat, datetime } from '../src/datetime'
import { fallbackWithSimple } from '../src/fallbacker'
import { clearNumberFormat, number } from '../src/number'

import type { VueDevToolsEmitterEvents } from '@intlify/devtools-types'
import type { CoreInternalContext } from '../src/context'

const date = new Date(Date.UTC(2020, 0, 2))

const formatContracts = [
  {
    name: 'datetime',
    type: 'datetime format',
    resource: 'datetimeFormats',
    formatOptions: { year: 'numeric', timeZone: 'UTC' },
    overrides: { month: '2-digit' },
    format: (context: any, key: string, overrides?: Intl.DateTimeFormatOptions) =>
      overrides ? datetime(context, date, key, overrides) : datetime(context, date, key),
    cache: (context: any) => (context as CoreInternalContext).__datetimeFormatters,
    clear: (context: any, formats: any) => clearDateTimeFormat(context, 'en-US', formats)
  },
  {
    name: 'number',
    type: 'number format',
    resource: 'numberFormats',
    formatOptions: { style: 'decimal' },
    overrides: { minimumFractionDigits: 2 },
    format: (context: any, key: string, overrides?: Intl.NumberFormatOptions) =>
      overrides ? number(context, 1000, key, overrides) : number(context, 1000, key),
    cache: (context: any) => (context as CoreInternalContext).__numberFormatters,
    clear: (context: any, formats: any) => clearNumberFormat(context, 'en-US', formats)
  }
] as const

describe.each(formatContracts)('$name formatting pipeline', contract => {
  test('preserve fallback and missing event metadata', () => {
    const emitter = createEmitter<VueDevToolsEmitterEvents>()
    const onFallback = vi.fn()
    const onMissing = vi.fn()
    const missing = vi.fn()
    emitter.on('fallback', onFallback)
    emitter.on('missing', onMissing)

    const context = createCoreContext({
      locale: 'en-US',
      fallbackLocale: ['ja-JP'],
      localeFallbacker: fallbackWithSimple,
      fallbackWarn: false,
      missingWarn: false,
      missing,
      __v_emitter: emitter,
      [contract.resource]: {
        'en-US': {},
        'ja-JP': { target: contract.formatOptions }
      }
    })

    contract.format(context, 'target')

    expect(missing).toHaveBeenCalledWith(context, 'en-US', 'target', contract.type)
    expect(onMissing).toHaveBeenCalledWith({
      locale: 'en-US',
      key: 'target',
      type: contract.type,
      groupId: `${contract.type}:target`
    })
    expect(onFallback).toHaveBeenCalledWith({
      type: contract.type,
      key: 'target',
      from: 'en-US',
      to: 'ja-JP',
      groupId: `${contract.type}:target`
    })
  })

  test('reuse cached formatters and partition caches by overrides', () => {
    const formats = {
      'en-US': { target: contract.formatOptions }
    }
    const context = createCoreContext({
      locale: 'en-US',
      localeFallbacker: fallbackWithSimple,
      [contract.resource]: formats
    })

    contract.format(context, 'target')
    const cache = contract.cache(context)
    const cached = cache.get('en-US__target')

    contract.format(context, 'target')
    expect(cache.get('en-US__target')).toBe(cached)

    contract.format(context, 'target', contract.overrides)
    expect(cache.size).toBe(2)
    expect(cache.has(`en-US__target__${JSON.stringify(contract.overrides)}`)).toBe(true)
  })

  test('clear cached formatters for replaced resources', () => {
    const formats = {
      'en-US': { target: contract.formatOptions }
    }
    const context = createCoreContext({
      locale: 'en-US',
      localeFallbacker: fallbackWithSimple,
      [contract.resource]: formats
    })

    contract.format(context, 'target')
    contract.format(context, 'target', contract.overrides)
    expect(contract.cache(context).size).toBe(2)

    contract.clear(context, formats['en-US'])
    expect(contract.cache(context).size).toBe(0)
  })
})

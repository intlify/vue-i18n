// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mark, measure } from '../src/utils'

describe('performance timing utils', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('mark', () => {
    it('should be defined in browser environment', () => {
      expect(mark).toBeDefined()
    })

    it('should delegate to performance.mark', () => {
      const spyMark = vi.spyOn(window.performance, 'mark')

      if (!mark) throw new Error('mark is unexpectedly undefined in jsdom')

      mark('test-tag')

      expect(spyMark).toHaveBeenCalledTimes(1)
      expect(spyMark).toHaveBeenCalledWith('test-tag')
    })
  })

  describe('measure', () => {
    it('should be defined in browser environment', () => {
      expect(measure).toBeDefined()
    })

    it('should measure between two marks and clear them', () => {
      const spyMeasure = vi.spyOn(window.performance, 'measure')
      const spyClearMarks = vi.spyOn(window.performance, 'clearMarks')
      const spyClearMeasures = vi.spyOn(window.performance, 'clearMeasures')

      if (!mark) throw new Error('mark is unexpectedly undefined in jsdom')
      if (!measure) throw new Error('measure is unexpectedly undefined in jsdom')

      // Create marks first (required by the User Timing API spec)
      mark('start-tag')
      mark('end-tag')

      measure('test-measure', 'start-tag', 'end-tag')

      expect(spyMeasure).toHaveBeenCalledTimes(1)
      expect(spyMeasure).toHaveBeenCalledWith('test-measure', 'start-tag', 'end-tag')

      expect(spyClearMarks).toHaveBeenCalledTimes(2)
      expect(spyClearMarks).toHaveBeenNthCalledWith(1, 'start-tag')
      expect(spyClearMarks).toHaveBeenNthCalledWith(2, 'end-tag')

      expect(spyClearMeasures).toHaveBeenCalledTimes(1)
      expect(spyClearMeasures).toHaveBeenCalledWith('test-measure')
    })
  })
})

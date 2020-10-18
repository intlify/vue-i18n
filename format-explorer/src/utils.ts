import { customRef } from 'vue'
import type { Ref } from 'vue'

/* eslint-disable */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  let prevTimer: number | null = null
  return ((...args: any[]) => {
    if (prevTimer) {
      clearTimeout(prevTimer)
    }
    prevTimer = window.setTimeout(() => {
      fn(...args)
      prevTimer = null
    }, delay)
  }) as any
}
/* eslint-enable */

export function useDebouncedRef<T>(value: T, delay = 200): Ref<T> {
  let timeout: ReturnType<typeof setTimeout>
  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

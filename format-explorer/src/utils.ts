import { customRef } from 'vue'
import type { Ref } from 'vue'

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

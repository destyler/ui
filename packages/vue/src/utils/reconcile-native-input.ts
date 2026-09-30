import type { InputHTMLAttributes } from 'vue'
import { nextTick } from 'vue'

/**
 * Native activation happens before the machine receives a click. A controlled
 * setter can reject it without changing the snapshot, so Vue will not patch an
 * unchanged checked prop. Reconcile after both activation and parent updates.
 */
export function reconcileNativeInput(
  props: InputHTMLAttributes,
  restore: (input: HTMLInputElement) => void,
): InputHTMLAttributes {
  return {
    ...props,
    onClick(event) {
      const input = event.currentTarget as HTMLInputElement
      props.onClick?.(event)
      void nextTick(() => {
        if (input.isConnected)
          restore(input)
      })
    },
  }
}

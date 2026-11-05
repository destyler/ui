import { mergeProps, useAttrs } from 'vue'

export function useSelectPartProps(getProps: () => object) {
  const attrs = useAttrs()

  // Read attrs during render so listener replacement/removal stays current.
  return () => {
    const coreProps = getProps() as Record<string, unknown>
    const merged = mergeProps(coreProps, attrs)

    for (const key in coreProps) {
      const handler = coreProps[key]
      if (!/^on[^a-z]/.test(key) || (typeof handler !== 'function' && !Array.isArray(handler)))
        continue

      // Keep Vue's native listener arrays for error handling and
      // stopImmediatePropagation, including a sole asChild child listener.
      const listeners = mergeProps({ [key]: attrs[key] }, { [key]: handler })[key]
      merged[key] = Array.isArray(listeners) ? listeners : [listeners]
    }

    return merged
  }
}

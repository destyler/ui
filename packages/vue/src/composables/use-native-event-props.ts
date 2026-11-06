import { createOnceListenerProps, getNativeReceiverCore } from '../utils/core-listeners'

/**
 * Compose forwarded UI event props at an actual native element boundary.
 * Create one instance per receiving element in setup and call it during render.
 * Pass original listener references (or Vue mergeProps arrays), not emit payloads
 * or callbacks hidden inside wrapper functions. Custom component events retain
 * their own Vue Once semantics and should not be passed through this helper.
 */
export function useNativeEventProps() {
  const compose = createOnceListenerProps()
  return (props: Record<string, unknown>) => compose(props, getNativeReceiverCore(props))
}

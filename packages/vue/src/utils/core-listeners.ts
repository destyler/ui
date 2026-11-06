import type { VNode } from 'vue'
import { mergeProps, useAttrs } from 'vue'

type Listener = (event: Event) => unknown
const knownCoreListeners = new WeakSet<object>()
const mergedOnceCallbacks = new WeakMap<object, unknown[]>()

// Dynamic must preserve a custom component's Function-valued callback prop.
// Retain constituent callbacks privately so an opted-in native receiver can
// restore Vue's per-callback error/stopImmediate semantics at the DOM boundary.
export function rememberOnceCallbacks(merged: unknown, callbacks: unknown) {
  if (typeof merged !== 'function' || merged === callbacks)
    return
  const list = Array.isArray(callbacks) ? callbacks : [callbacks]
  if (!list.includes(merged))
    mergedOnceCallbacks.set(merged, list)
}

function expandOnceCallbacks(value: unknown): unknown[] {
  const list = Array.isArray(value) ? value : [value]
  return list.flatMap((listener) => {
    const merged = typeof listener === 'function' ? mergedOnceCallbacks.get(listener) : undefined
    return merged ? expandOnceCallbacks(merged) : [listener]
  })
}

export function useCoreListenerProps(getProps: () => object) {
  const attrs = useAttrs()
  return () => {
    const core = getProps() as Record<string, unknown>
    const merged = mergeProps(core, attrs)
    for (const key in core) {
      const handler = core[key]
      if (!/^on[^a-z]/.test(key) || (typeof handler !== 'function' && !Array.isArray(handler)))
        continue
      for (const fn of Array.isArray(handler) ? handler : [handler]) {
        if (typeof fn === 'function')
          knownCoreListeners.add(fn)
      }
      const listeners = mergeProps({ [key]: attrs[key] }, { [key]: handler })[key]
      merged[key] = Array.isArray(listeners) ? listeners : [listeners]
    }
    merged.__uiComposeOnce = core
    return merged
  }
}

interface OnceListener {
  active: WeakMap<Event, boolean>
  begin: Listener
  composed: boolean
}

function createOnceListener(): OnceListener {
  const consumed = new WeakSet<EventTarget>()
  const active = new WeakMap<Event, boolean>()
  return {
    active,
    composed: false,
    begin(event) {
      const target = event.currentTarget
      const allowed = target !== null && !consumed.has(target)
      active.set(event, allowed)
      // Consume before callbacks, including .self rejection, errors and reentry.
      if (allowed)
        consumed.add(target!)
    },
  }
}

export function createOnceListenerProps() {
  const states = new Map<string, OnceListener>()
  return (input: Record<string, unknown>, core?: Record<string, unknown>) => {
    if (!core && !states.size)
      return input
    const props = { ...input }
    const present = new Set<string>()
    for (const key in props) {
      if (!key.endsWith('Once'))
        continue
      const base = key.slice(0, -4)
      // Capture/passive retain their native options and propagation phase.
      if (!/^on[^a-z]/.test(base) || /(?:Capture|Passive)$/.test(base))
        continue
      const value = props[key]
      if (typeof value !== 'function' && !Array.isArray(value))
        continue
      present.add(key)
      let state = states.get(key)
      if (!state) {
        state = createOnceListener()
        states.set(key, state)
      }
      const current = state
      const onceHandlers = expandOnceCallbacks(value).map(listener =>
        (event: Event) => current.active.get(event) && listener ? (listener as Listener)(event) : undefined)
      const ordinary = props[base]
      const handlers = ordinary == null ? [] : Array.isArray(ordinary) ? ordinary : [ordinary]
      const internal = (Array.isArray(core?.[base]) ? core[base] : [core?.[base]]).filter((handler: unknown) => typeof handler === 'function')
      const boundary = handlers.findIndex((handler: unknown) => typeof handler === 'function' && internal.includes(handler))
      if (boundary >= 0)
        state.composed = true
      if (state.composed) {
        // Once composed, stay composed until removal, even if core disappears:
        // switching back to a native Once registration would rearm consumption.
        const index = boundary < 0 ? handlers.length : boundary
        props[base] = [...handlers.slice(0, index), state.begin, ...onceHandlers, ...handlers.slice(index)]
        delete props[key]
      }
      else {
        // Keep unrelated Once native, but observe its consumption so adding a
        // core handler later does not accidentally rearm it.
        props[key] = [state.begin, ...onceHandlers]
      }
    }
    for (const key of states.keys()) {
      if (!present.has(key))
        states.delete(key)
    }
    return props
  }
}

export function useOnceListenerComposition() {
  const compose = createOnceListenerProps()
  return (vnode: VNode, core?: Record<string, unknown>) => {
    // Undeclared emits and callback props make arbitrary components ambiguous.
    if (typeof vnode.type === 'string' && vnode.props)
      vnode.props = compose(vnode.props, core)
    return vnode
  }
}

export function getNativeReceiverCore(props: Record<string, unknown>) {
  const core: Record<string, unknown> = {}
  for (const key in props) {
    if (!/^on[^a-z]/.test(key))
      continue
    const handlers = Array.isArray(props[key]) ? props[key] : [props[key]]
    const known = handlers.filter((handler: unknown) => typeof handler === 'function' && knownCoreListeners.has(handler))
    if (known.length)
      core[key] = known
  }
  return core
}

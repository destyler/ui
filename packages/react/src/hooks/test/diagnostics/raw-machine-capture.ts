interface RawMachineService {
  id: string
  getState: () => {
    value: unknown
    tags: unknown
    event: unknown
    previousEvent: unknown
    context: { id?: unknown, open?: unknown, isPointer?: unknown }
  }
}

interface CapturedService {
  service: RawMachineService
  instance: number
}

interface Capture {
  id: string
  services: Set<CapturedService>
}

declare const __HOVER_CARD_RAW_TRACE__: boolean

export const rawMachineTraceEnabled = typeof __HOVER_CARD_RAW_TRACE__ !== 'undefined' && __HOVER_CARD_RAW_TRACE__

let activeCapture: Capture | undefined
let nextInstance = 0

/** Called only from the diagnostic hook's layout effect, never during SSR. */
export function captureMountedMachine(service: RawMachineService) {
  const capture = activeCapture
  if (!capture || service.id !== capture.id)
    return

  const entry = { service, instance: ++nextInstance }
  capture.services.add(entry)
  return () => capture.services.delete(entry)
}

/** A scoped raw reader. It adds no store subscriptions and never reads React's proxy. */
export function startRawMachineCapture(id = 'hover-card') {
  if (activeCapture)
    throw new Error('A raw machine capture is already active')

  const capture: Capture = { id, services: new Set() }
  activeCapture = capture
  return {
    read() {
      if (activeCapture !== capture || capture.services.size !== 1)
        return undefined

      const [{ service, instance }] = capture.services
      const state = service.getState()
      // Copy at the checkpoint: events/context can hold mutable reference values.
      return JSON.parse(JSON.stringify({
        id: service.id,
        instance,
        value: state.value,
        tags: state.tags,
        event: state.event,
        previousEvent: state.previousEvent,
        context: {
          id: state.context.id,
          open: state.context.open,
          isPointer: state.context.isPointer,
        },
      }, (_key, value) => value === undefined ? null : value))
    },
    stop() {
      capture.services.clear()
      if (activeCapture === capture)
        activeCapture = undefined
    },
  }
}

interface OpenState {
  open: boolean
}

interface TraceEntry {
  elapsed: number
  type: string
  details: unknown
}

function describeTarget(target: EventTarget | null) {
  if (!(target instanceof Element))
    return target === document ? '#document' : null
  return {
    tag: target.tagName,
    id: target.id,
    scope: target.getAttribute('data-scope'),
    part: target.getAttribute('data-part'),
    state: target.getAttribute('data-state'),
  }
}

/** Observe the failing contract without moving the pointer or changing timers. */
export function createOpenStateTrace(options: { rawTraceEnabled?: boolean } = {}) {
  const startedAt = performance.now()
  const entries: TraceEntry[] = []
  let droppedEntries = 0
  let container: HTMLElement | undefined
  let readApi: (() => OpenState) | undefined
  let readMachine: (() => unknown) | undefined
  const record = (type: string, details: unknown) => {
    if (entries.length === 200) {
      entries.shift()
      droppedEntries++
    }
    entries.push({ elapsed: performance.now() - startedAt, type, details })
  }
  const eventTypes = ['pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'focusin', 'focusout'] as const
  const onEvent = (event: Event) => {
    record('event', {
      type: event.type,
      target: describeTarget(event.target),
      relatedTarget: describeTarget((event as MouseEvent).relatedTarget),
      pointerType: (event as PointerEvent).pointerType,
      clientX: (event as PointerEvent).clientX,
      clientY: (event as PointerEvent).clientY,
      isTrusted: event.isTrusted ?? null,
      apiOpen: readApi?.().open,
    })
  }
  for (const type of eventTypes)
    document.addEventListener(type, onEvent, { capture: true, passive: true })

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      record('mutation', {
        target: describeTarget(mutation.target as Element),
        attribute: mutation.attributeName,
        previous: mutation.oldValue,
        value: (mutation.target as Element).getAttribute(mutation.attributeName!),
        apiOpen: readApi?.().open,
      })
    }
  })

  return {
    record,
    attach(element: HTMLElement, getApi: () => OpenState, getMachine?: () => unknown) {
      container = element
      readApi = getApi
      readMachine = getMachine
      observer.observe(element, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['data-state', 'hidden'],
        subtree: true,
      })
      record('mounted', { apiOpen: getApi().open, html: element.innerHTML })
    },
    report() {
      return JSON.stringify({
        rawTraceEnabled: options.rawTraceEnabled ?? false,
        entries,
        droppedEntries,
        final: {
          apiOpen: readApi?.().open,
          machine: readMachine?.(),
          activeElement: describeTarget(document.activeElement),
          hovered: Array.from(document.querySelectorAll(':hover'), describeTarget),
          html: container?.innerHTML,
        },
      }, null, 2)
    },
    dispose() {
      observer.disconnect()
      for (const type of eventTypes)
        document.removeEventListener(type, onEvent, true)
    },
  }
}

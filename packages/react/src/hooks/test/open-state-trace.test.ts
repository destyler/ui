import { afterEach, describe, expect, it } from 'vitest'
import { createOpenStateTrace } from './open-state-trace'

const traces: ReturnType<typeof createOpenStateTrace>[] = []
afterEach(() => {
  for (const trace of traces.splice(0))
    trace.dispose()
  document.body.replaceChildren()
})

function createTrace() {
  const trace = createOpenStateTrace()
  traces.push(trace)
  return trace
}

describe('open-state failure diagnostics', () => {
  it('records API, DOM, and callback state without changing them', async () => {
    const trace = createTrace()
    const container = document.createElement('div')
    const trigger = document.createElement('button')
    trigger.setAttribute('data-state', 'open')
    container.append(trigger)
    document.body.append(container)
    const api = { open: true }
    trace.attach(container, () => api)

    api.open = false
    trigger.setAttribute('data-state', 'closed')
    trace.record('onOpenChange', { open: false })
    await new Promise<void>(resolve => setTimeout(resolve, 0))

    const report = JSON.parse(trace.report())
    expect(report.final.apiOpen).toBe(false)
    expect(report.final.html).toContain('data-state="closed"')
    expect(report.entries).toContainEqual(expect.objectContaining({
      type: 'mutation',
      details: expect.objectContaining({ attribute: 'data-state', previous: 'open', value: 'closed', apiOpen: false }),
    }))
    expect(report.entries).toContainEqual(expect.objectContaining({ type: 'onOpenChange', details: { open: false } }))
    expect(api.open).toBe(false)
    expect(trigger.getAttribute('data-state')).toBe('closed')
  })

  it('captures pointer target, coordinates, and trust without preventing the event', () => {
    const trace = createTrace()
    const trigger = document.createElement('button')
    trigger.setAttribute('data-scope', 'hover-card')
    trigger.setAttribute('data-part', 'trigger')
    document.body.append(trigger)
    const event = new PointerEvent('pointerover', { bubbles: true, cancelable: true, pointerType: 'mouse', clientX: 12, clientY: 34 })
    expect(trigger.dispatchEvent(event)).toBe(true)
    expect(event.defaultPrevented).toBe(false)
    expect(JSON.parse(trace.report()).entries).toContainEqual(expect.objectContaining({
      type: 'event',
      details: expect.objectContaining({
        type: 'pointerover',
        pointerType: 'mouse',
        clientX: 12,
        clientY: 34,
        isTrusted: event.isTrusted ?? null,
        target: expect.objectContaining({ scope: 'hover-card', part: 'trigger' }),
      }),
    }))
  })

  it('limits the trace and reports how many earlier entries were dropped', () => {
    const trace = createTrace()
    for (let iteration = 0; iteration < 205; iteration++)
      trace.record('request', { iteration })
    const report = JSON.parse(trace.report())
    expect(report.entries).toHaveLength(200)
    expect(report.droppedEntries).toBe(5)
    expect(report.entries[0].details.iteration).toBe(5)
  })

  it('removes event listeners when disposed', () => {
    const trace = createTrace()
    trace.dispose()
    document.body.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }))
    expect(JSON.parse(trace.report()).entries).toEqual([])
  })
})

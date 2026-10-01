import type { Root } from 'react-dom/client'
import { createMachine } from '@destyler/xstate'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { captureMountedMachine, rawMachineTraceEnabled, startRawMachineCapture } from './raw-machine-capture'
import { useMachine } from './use-captured-machine'

const captures: ReturnType<typeof startRawMachineCapture>[] = []
const roots: Root[] = []
afterEach(async () => {
  for (const root of roots.splice(0))
    await act(async () => root.unmount())
  for (const capture of captures.splice(0))
    capture.stop()
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

function startCapture() {
  const capture = startRawMachineCapture()
  captures.push(capture)
  return capture
}

function fixture(id = 'hover-card') {
  const state = {
    value: 'open',
    tags: ['open'],
    event: { type: 'OPEN', src: 'trigger' },
    previousEvent: { type: 'POINTER_ENTER' },
    context: { id: 'fixture', open: undefined, isPointer: true },
  }
  const service = { id, getState: vi.fn(() => state) }
  return { service, state }
}

describe('raw machine diagnostic boundaries', () => {
  it('ignores mounts outside the capture and unrelated machines, without reading state', () => {
    const { service } = fixture()
    expect(captureMountedMachine(service)).toBeUndefined()
    const capture = startCapture()
    expect(captureMountedMachine(fixture('other-machine').service)).toBeUndefined()
    expect(capture.read()).toBeUndefined()
    expect(service.getState).not.toHaveBeenCalled()

    const release = captureMountedMachine(service)
    expect(service.getState).not.toHaveBeenCalled()
    expect(capture.read()).toMatchObject({ id: 'hover-card', value: 'open' })
    release?.()
    expect(capture.read()).toBeUndefined()
  })

  it('copies mutable event and context values at each checkpoint', () => {
    const capture = startCapture()
    const { service, state } = fixture()
    captureMountedMachine(service)
    const before = capture.read()
    state.value = 'closed'
    state.tags[0] = 'closed'
    state.event.type = 'CLOSE'
    state.context.isPointer = false
    const after = capture.read()
    expect(before).toMatchObject({
      value: 'open',
      tags: ['open'],
      event: { type: 'OPEN' },
      context: { open: null, isPointer: true },
    })
    expect(after).toMatchObject({ value: 'closed', tags: ['closed'], event: { type: 'CLOSE' }, context: { isPointer: false } })
    expect(after.instance).toBe(before.instance)
  })

  it('rejects ambiguous mounts and releases stopped captures without affecting the next one', () => {
    const first = startCapture()
    const releaseFirst = captureMountedMachine(fixture().service)
    const releaseDuplicate = captureMountedMachine(fixture().service)
    expect(first.read()).toBeUndefined()
    releaseDuplicate?.()
    expect(first.read()).toMatchObject({ id: 'hover-card' })
    first.stop()
    expect(first.read()).toBeUndefined()

    const second = startCapture()
    captureMountedMachine(fixture().service)
    releaseFirst?.()
    first.stop()
    expect(second.read()).toMatchObject({ id: 'hover-card' })
  })

  it('captures only committed mounts, preserves API dispatch, and releases on unmount', async () => {
    expect(rawMachineTraceEnabled, 'Run this opt-in probe with HOVER_CARD_RAW_TRACE=1').toBe(true)
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const capture = startCapture()
    const create = () => createMachine({
      id: 'hover-card',
      initial: 'closed',
      context: { id: 'mounted-fixture' },
      states: { closed: { tags: ['closed'], on: { OPEN: 'open' } }, open: { tags: ['open'], on: { CLOSE: 'closed' } } },
    })
    let result: ReturnType<typeof useMachine> | undefined
    function Probe() {
      'use no memo'
      result = useMachine(create())
      return <output>{result[0].value}</output>
    }
    expect(renderToString(<Probe />)).toBe('<output>closed</output>')
    expect(capture.read()).toBeUndefined()

    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    roots.push(root)
    await act(async () => root.render(<Probe />))
    expect(capture.read()).toMatchObject({ value: 'closed', context: { id: 'mounted-fixture' } })
    expect(result![1]).toBe(result![2].send)
    await act(async () => result![1]('OPEN'))
    expect(capture.read()).toMatchObject({ value: 'open' })
    expect(container.textContent).toBe('open')
    await act(async () => root.unmount())
    roots.splice(roots.indexOf(root), 1)
    expect(capture.read()).toBeUndefined()
  })
})

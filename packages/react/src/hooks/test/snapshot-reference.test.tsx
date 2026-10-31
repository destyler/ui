import { createMachine } from '@destyler/xstate'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { useMachine } from '../use-machine'

it('preserves snapshot and actor references on prop-only renders without losing full-snapshot updates', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const machine = createMachine({
    initial: 'idle',
    context: { count: 0 },
    states: { idle: { on: { PING: {} } } },
  })
  const container = document.createElement('div')
  const root = createRoot(container)
  let current: ReturnType<typeof useMachine>
  let renders = 0
  function Harness({ label }: { label: string }) {
    'use no memo'
    current = useMachine(machine)
    renders++
    // Intentionally do not read snapshot properties: subscriptions must not
    // depend on which fields a caller or the React Compiler happened to read.
    return <span>{label}</span>
  }
  try {
    await act(async () => root.render(<Harness label="first" />))
    const initial = current!
    await act(async () => root.render(<Harness label="second" />))
    expect(container.textContent).toBe('second')
    expect(current![0]).toBe(initial[0])
    expect(current![1]).toBe(initial[1])
    expect(current![2]).toBe(initial[2])

    const beforeEvent = renders
    await act(async () => current![1]('PING'))
    expect(renders).toBeGreaterThan(beforeEvent)
    expect(current![0]).not.toBe(initial[0])
    expect(current![0].event.type).toBe('PING')
    expect(current![0].context).toBe(initial[0].context)
    expect(current![1]).toBe(initial[1])
    expect(current![2]).toBe(initial[2])

    await act(async () => machine.setContext({ count: 1 }))
    expect(current![0].context.count).toBe(1)
  }
  finally {
    await act(async () => root.unmount())
    vi.unstubAllGlobals()
  }
})

import type { ReactNode } from 'react'
import type { Root } from 'react-dom/client'
import { act, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Timer } from '../index'

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined

afterEach(() => {
  act(() => root?.unmount())
  root = undefined
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

function mount(children: ReactNode) {
  const host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  act(() => root!.render(children))
  return host
}

function State() {
  return <Timer.Context>{api => <output data-running={String(api.running)} data-paused={String(api.paused)} data-time-ms={((api.time.days * 24 + api.time.hours) * 60 + api.time.minutes) * 60000 + api.time.seconds * 1000 + api.time.milliseconds} />}</Timer.Context>
}

async function click(button: HTMLButtonElement) {
  await act(async () => button.click())
}

describe('[timer] ActionTrigger DOM props and actions', () => {
  it.each([false, true])('consumes action and preserves button props/ref (asChild=%s)', (asChild) => {
    const ref = createRef<HTMLButtonElement>()
    const host = mount(
      <Timer.Root>
        <Timer.ActionTrigger action="start" asChild={asChild} ref={ref} className="timer-action" data-testid="trigger" aria-label="Start timer">
          {asChild ? <button data-child="true">Start</button> : 'Start'}
        </Timer.ActionTrigger>
      </Timer.Root>,
    )
    const button = host.querySelector('button')!
    expect(button.hasAttribute('action')).toBe(false)
    expect(button.type).toBe('button')
    expect(button.className).toContain('timer-action')
    expect(button.getAttribute('aria-label')).toBe('Start timer')
    expect(button.getAttribute('data-testid')).toBe('trigger')
    expect(button.getAttribute('data-child')).toBe(asChild ? 'true' : null)
    expect(ref.current).toBe(button)
  })

  it('preserves repeated start, pause, resume and reset without submitting its form', async () => {
    const submit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) => event.preventDefault())
    const host = mount(
      <form onSubmit={submit}>
        <Timer.Root startMs={60000} countdown interval={25}>
          <State />
          {(['start', 'pause', 'resume', 'reset'] as const).map(action => <Timer.ActionTrigger key={action} action={action} data-action={action}>{action}</Timer.ActionTrigger>)}
        </Timer.Root>
      </form>,
    )
    const state = (running: boolean, paused: boolean) => {
      expect(host.querySelector('output')?.getAttribute('data-running')).toBe(String(running))
      expect(host.querySelector('output')?.getAttribute('data-paused')).toBe(String(paused))
    }
    const time = () => Number(host.querySelector('output')?.getAttribute('data-time-ms'))
    state(false, false)
    expect(time()).toBe(60000)
    for (let cycle = 0; cycle < 2; cycle++) {
      for (const [action, running, paused] of [['start', true, false], ['pause', false, true], ['resume', true, false], ['pause', false, true], ['reset', false, false]] as const) {
        const button = host.querySelector<HTMLButtonElement>(`[data-action="${action}"]`)!
        expect(button.hasAttribute('action')).toBe(false)
        expect(button.type).toBe('button')
        expect(button.hidden).toBe(false)
        await click(button)
        await vi.waitFor(() => state(running, paused))
        if (action === 'start')
          await vi.waitFor(() => expect(time()).toBeLessThan(60000))
        if (action === 'reset')
          expect(time()).toBe(60000)
      }
    }
    expect(submit).not.toHaveBeenCalled()
  })

  it('preserves a consumer preventDefault handler', async () => {
    const prevented = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault())
    const host = mount(<Timer.Root startMs={60000} countdown><State /><Timer.ActionTrigger action="start" onClick={prevented}>Start</Timer.ActionTrigger></Timer.Root>)
    await click(host.querySelector('button')!)
    expect(prevented).toHaveBeenCalledOnce()
    expect(host.querySelector('output')?.getAttribute('data-running')).toBe('false')
  })

  it('uses the latest callback after rerender without suppressing the machine action', async () => {
    const prevented = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault())
    const latest = vi.fn()
    const view = (action: 'start' | 'pause', onClick: React.MouseEventHandler<HTMLButtonElement>) => (
      <Timer.Root startMs={60000} countdown interval={25}><State /><Timer.ActionTrigger action={action} onClick={onClick}>Action</Timer.ActionTrigger></Timer.Root>
    )
    const host = mount(view('start', prevented))
    await click(host.querySelector('button')!)
    expect(prevented).toHaveBeenCalledOnce()
    expect(host.querySelector('output')?.getAttribute('data-running')).toBe('false')
    act(() => root!.render(view('start', latest)))
    await click(host.querySelector('button')!)
    expect(latest).toHaveBeenCalledOnce()
    expect(prevented).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(host.querySelector('output')?.getAttribute('data-running')).toBe('true'))
  })

  it('uses a changed action prop on an existing trigger independently of callback replacement', async () => {
    const onClick = vi.fn()
    const view = (action: 'start' | 'pause') => (
      <Timer.Root startMs={60000} countdown interval={25} autoStart>
        <State />
        <Timer.ActionTrigger action={action} onClick={onClick}>Action</Timer.ActionTrigger>
      </Timer.Root>
    )
    const host = mount(view('start'))
    const button = host.querySelector('button')!
    expect(host.querySelector('output')?.getAttribute('data-running')).toBe('true')
    expect(button.hidden).toBe(true)
    act(() => root!.render(view('pause')))
    expect(host.querySelector('button')).toBe(button)
    expect(button.hidden).toBe(false)
    expect(button.hasAttribute('action')).toBe(false)
    await click(button)
    expect(onClick).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(host.querySelector('output')?.getAttribute('data-paused')).toBe('true'))
  })
})

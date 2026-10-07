import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { Presence } from '../index'

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
const disposers: (() => void)[] = []
afterEach(async () => {
  await act(async () => disposers.splice(0).forEach(dispose => dispose()))
})
afterAll(() => vi.unstubAllGlobals())

function mount() {
  const container = document.createElement('div')
  document.body.append(container)
  const style = document.createElement('style')
  style.textContent = '@keyframes presence-audit-enter { from { opacity: .9 } to { opacity: 1 } } @keyframes presence-audit-exit { from { opacity: 1 } to { opacity: .9 } }'
  document.head.append(style)
  const root = createRoot(container)
  disposers.push(() => {
    root.unmount()
    container.remove()
    style.remove()
  })
  // Long-running real CSS animations keep transitions pending; dispatch their
  // lifecycle events explicitly so event ownership, not wall-clock timing, is tested.
  const render = async (present: boolean, onExitComplete: () => void) => {
    await act(async () => root.render(
      <Presence present={present} immediate unmountOnExit onExitComplete={onExitComplete} style={{ animationName: present ? 'presence-audit-enter' : 'presence-audit-exit', animationDuration: '60s' }}>
        <span>Animated child</span>
      </Presence>,
    ))
  }
  const node = () => container.querySelector<HTMLElement>('[data-scope="presence"]')
  return { render, node }
}

it('retains exiting DOM until its own animation ends and ignores descendant events', async () => {
  const { render, node } = mount()
  const exited = vi.fn()
  await render(true, exited)
  const target = node()!
  await render(false, exited)
  expect(node()).toBe(target)
  expect(target.hidden).toBe(false)
  expect(target.dataset.state).toBe('closed')
  await act(async () => target.querySelector('span')!.dispatchEvent(new Event('animationend', { bubbles: true })))
  expect(node()).toBe(target)
  expect(exited).not.toHaveBeenCalled()
  await act(async () => target.dispatchEvent(new Event('animationend', { bubbles: true })))
  expect(node()).toBeNull()
  expect(exited).toHaveBeenCalledTimes(1)
  target.dispatchEvent(new Event('animationend', { bubbles: true }))
  expect(exited).toHaveBeenCalledTimes(1)
})

it('keeps reopened content mounted when a prior exit event arrives, then allows a later exit', async () => {
  const { render, node } = mount()
  const exited = vi.fn()
  await render(true, exited)
  const target = node()!
  await render(false, exited)
  expect(node()).toBe(target)
  await render(true, exited)
  expect(node()).toBe(target)
  expect(target.hidden).toBe(false)
  expect(target.dataset.state).toBe('open')
  await act(async () => target.dispatchEvent(new Event('animationend', { bubbles: true })))
  expect(node()).toBe(target)
  expect(exited).not.toHaveBeenCalled()
  await render(false, exited)
  await act(async () => target.dispatchEvent(new Event('animationend', { bubbles: true })))
  expect(node()).toBeNull()
  expect(exited).toHaveBeenCalledTimes(1)
})

it('uses the newest exit callback after an unrelated prop commit during exit', async () => {
  const { render, node } = mount()
  const first = vi.fn()
  const latest = vi.fn()
  await render(true, first)
  await render(false, first)
  const target = node()!
  await render(false, latest)
  await act(async () => target.dispatchEvent(new Event('animationend', { bubbles: true })))
  expect(node()).toBeNull()
  expect(first).not.toHaveBeenCalled()
  expect(latest).toHaveBeenCalledTimes(1)
})

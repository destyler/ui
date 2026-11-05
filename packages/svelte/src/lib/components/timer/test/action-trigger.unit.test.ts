import { flushSync, mount, tick, unmount } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ActionTriggerFixture from './ActionTriggerFixture.svelte'

let component: ReturnType<typeof mount> & { setAction: (action: 'start' | 'pause' | 'resume' | 'reset') => void } | undefined

afterEach(async () => {
  if (component)
    await unmount(component)
  component = undefined
  document.body.replaceChildren()
})

function setup(asChild: boolean, onclick = vi.fn<(event: MouseEvent) => void>()) {
  const host = document.createElement('div')
  document.body.append(host)
  component = mount(ActionTriggerFixture, { target: host, props: { asChild, onclick } })
  flushSync()
  return { host, onclick, button: host.querySelector('button')! }
}

describe('[timer] ActionTrigger client props and actions', () => {
  it.each([false, true])('keeps reactive actions and callbacks without leaking action (asChild=%s)', async (asChild) => {
    const { host, button, onclick } = setup(asChild)
    expect(button.hasAttribute('action')).toBe(false)
    expect(button.type).toBe('button')
    expect(button.className).toContain('timer-action')
    expect(button.getAttribute('aria-label')).toBe('Timer action')
    expect(button.getAttribute('data-child')).toBe(asChild ? 'true' : null)
    for (const [action, running, paused] of [['start', true, false], ['pause', false, true], ['resume', true, false], ['pause', false, true], ['reset', false, false]] as const) {
      component!.setAction(action)
      await tick()
      expect(button.hidden).toBe(false)
      expect(button.hasAttribute('action')).toBe(false)
      button.click()
      await vi.waitFor(() => {
        expect(host.querySelector('output')?.getAttribute('data-running')).toBe(String(running))
        expect(host.querySelector('output')?.getAttribute('data-paused')).toBe(String(paused))
      })
    }
    expect(onclick).toHaveBeenCalledTimes(5)
  })

  it('preserves a consumer preventDefault handler', async () => {
    const onclick = vi.fn((event: MouseEvent) => event.preventDefault())
    const { host, button } = setup(false, onclick)
    button.click()
    await tick()
    expect(onclick).toHaveBeenCalledOnce()
    expect(host.querySelector('output')?.getAttribute('data-running')).toBe('false')
  })
})

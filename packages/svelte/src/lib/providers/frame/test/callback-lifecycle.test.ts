import { mount, tick, unmount } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Fixture from './CallbackLifecycle.svelte'

const mounted: { instance: ReturnType<typeof mount>, container: HTMLElement }[] = []
afterEach(async () => {
  for (const { instance, container } of mounted.splice(0)) {
    await unmount(instance)
    container.remove()
  }
})

async function setup(frame: boolean, incrementOnMount = false) {
  const onMountCall = vi.fn()
  const onUnmountCall = vi.fn()
  const container = document.createElement('div')
  document.body.append(container)
  const instance = mount(Fixture, { target: container, props: { frame, incrementOnMount, onMountCall, onUnmountCall } })
  const entry = { instance, container }
  mounted.push(entry)
  await tick()
  await vi.waitFor(() => expect(onMountCall).toHaveBeenCalled())
  const child = () => frame
    ? container.querySelector('iframe')!.contentDocument!.querySelector('[data-testid="child"]')
    : container.querySelector('[data-testid="child"]')
  const click = async (label: string) => {
    const button = Array.from(container.querySelectorAll('button')).find(button => button.textContent === label)!
    button.click()
    await tick()
  }
  const dispose = async () => {
    mounted.splice(mounted.indexOf(entry), 1)
    await unmount(instance)
    container.remove()
  }
  return { container, child, click, dispose, onMountCall, onUnmountCall }
}

describe.each([false, true])('frame callback dependency isolation (public frame=%s)', (frame) => {
  it('does not remount when state read by onMount changes', async () => {
    const screen = await setup(frame)
    const child = screen.child()
    expect(child).not.toBeNull()
    expect(screen.onMountCall.mock.calls).toEqual([['first', 0]])
    for (let value = 1; value <= 2; value++) {
      await screen.click('Change observed state')
      expect(screen.container.querySelector('output')!.textContent).toBe(String(value))
      expect(screen.child()).toBe(child)
      expect(screen.onMountCall.mock.calls).toEqual([['first', 0]])
      expect(screen.onUnmountCall).not.toHaveBeenCalled()
    }
    await screen.dispose()
    expect(screen.onUnmountCall.mock.calls).toEqual([['first']])
  })

  it('does not self-trigger when onMount writes the state it reads', async () => {
    const screen = await setup(frame, true)
    expect(screen.onMountCall.mock.calls).toEqual([['first', 1]])
    expect(screen.container.querySelector('output')!.textContent).toBe('1')
    expect(screen.onUnmountCall).not.toHaveBeenCalled()
    await screen.dispose()
    expect(screen.onUnmountCall.mock.calls).toEqual([['first']])
  })

  it('preserves explicit callback-prop replacement cleanup and setup', async () => {
    const screen = await setup(frame)
    const child = screen.child()
    await screen.click('Change mount callback')
    expect(screen.child()).toBe(child)
    expect(screen.onMountCall.mock.calls).toEqual([['first', 0], ['next', 0]])
    expect(screen.onUnmountCall.mock.calls).toEqual([['first']])
    await screen.click('Change unmount callback')
    expect(screen.child()).toBe(child)
    expect(screen.onMountCall.mock.calls).toEqual([['first', 0], ['next', 0], ['next', 0]])
    expect(screen.onUnmountCall.mock.calls).toEqual([['first'], ['first']])
    await screen.dispose()
    expect(screen.onUnmountCall.mock.calls).toEqual([['first'], ['first'], ['next']])
  })
})

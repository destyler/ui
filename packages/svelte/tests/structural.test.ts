import { flushSync, mount, unmount } from 'svelte'
import { afterEach, describe, expect, it } from 'vitest'
import AttachmentFixture from './structural-attachment.fixture.svelte'
import Fixture from './structural-reactive.fixture.svelte'

const cleanups: (() => Promise<void>)[] = []
afterEach(async () => {
  for (const cleanup of cleanups.splice(0))
    await cleanup()
})

describe('structural rendered contracts', () => {
  it('reacts without replacing nodes and preserves label association', async () => {
    const host = document.createElement('main')
    document.body.append(host)
    const component = mount(Fixture, { target: host })
    cleanups.push(async () => {
      await unmount(component)
      host.remove()
    })
    flushSync()
    const frame = host.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="root"]')!
    expect(frame.style.paddingBottom).toBe('50%')
    expect(host.querySelector('#caller-content')?.parentElement).toBe(frame)
    expect(host.querySelector('label')?.htmlFor).toBe('control')
    expect(host.querySelector('[role="separator"]')?.getAttribute('aria-orientation')).toBe('horizontal')
    expect(host.querySelector('[data-scope="breadcrumbs"][data-part="separator"]')?.getAttribute('aria-hidden')).toBe('true')
    component.update()
    flushSync()
    await expect.poll(() => frame.style.paddingBottom).toBe('200%')
    expect(host.querySelector('[data-scope="aspect-ratio"][data-part="root"]')).toBe(frame)
    expect(host.querySelector('[role="separator"]')?.getAttribute('aria-orientation')).toBe('vertical')
  })

  it('preserves an asChild label attachment and releases it on unmount', async () => {
    const host = document.createElement('main')
    document.body.append(host)
    let received: Element | null = null
    const component = mount(AttachmentFixture, { target: host, props: { onRef: element => received = element } })
    flushSync()
    try {
      expect(host.querySelectorAll('label')).toHaveLength(1)
      expect(received).toBe(host.querySelector('label'))
      expect(host.querySelector('label')?.htmlFor).toBe('field')
      expect(host.querySelector('label')?.id).toBe('caller-label')
    }
    finally {
      await unmount(component)
      host.remove()
    }
    expect(received).toBeNull()
  })
})

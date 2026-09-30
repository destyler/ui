import { normalizeProps } from '$lib/utils/normalize-props'
import * as core from '@destyler/navigation-menu'
import { hydrate, unmount } from 'svelte'
import { expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import { connectNavigationMenu } from '../hooks/connect-navigation-menu'
import serverHtml from './navigation-menu.ssr.html?raw'

it.each(['uncontrolled', 'controlled'] as const)('hydrates complete %s content, then preserves core motion and ownership', async (mode) => {
  const container = document.createElement('div')
  container.innerHTML = serverHtml
  document.body.appendChild(container)
  const errors = vi.spyOn(console, 'error')
  const warnings = vi.spyOn(console, 'warn')
  const onValueChange = vi.fn()
  expect(container.querySelector('[data-motion]')).toBeNull()
  let cleanup: () => void | Promise<void> = () => {}

  try {
    const root = hydrate(Basic, { target: container, props: { id: 'ssr-navigation', defaultValue: mode === 'controlled' ? 'getting-started' : 'components', value: mode === 'controlled' ? 'components' : undefined, disableHoverTrigger: true, onValueChange }, recover: false })
    cleanup = () => unmount(root)
    const content = (value: string) => container.querySelector(`[data-part="content"][data-value="${value}"]`)!
    // The same markup is rendered in a true-Node test. After hydration's first
    // matching render, mount enables the original core DOM-based motion API.
    await vi.waitFor(() => expect(content('components').getAttribute('data-motion')).toBe('from-start'))
    expect(content('components').hasAttribute('hidden')).toBe(false)
    expect(content('getting-started').hasAttribute('hidden')).toBe(true)
    expect(onValueChange).not.toHaveBeenCalled()

    const first = page.getByRole('button', { name: 'Getting started' })
    await userEvent.click(first)
    if (mode === 'controlled') {
      await vi.waitFor(() => expect(onValueChange).toHaveBeenLastCalledWith({ value: 'getting-started' }))
      expect(content('components').hasAttribute('hidden')).toBe(false)
      expect(content('getting-started').hasAttribute('hidden')).toBe(true)
      await userEvent.click(page.getByRole('button', { name: /^Components/ }))
      await vi.waitFor(() => expect(onValueChange).toHaveBeenLastCalledWith({ value: null }))
      expect(content('components').getAttribute('data-state')).toBe('open')
      expect(content('components').hasAttribute('hidden')).toBe(false)
      expect(errors).not.toHaveBeenCalled()
      expect(warnings).not.toHaveBeenCalled()
      return
    }
    await vi.waitFor(() => {
      expect(content('getting-started').getAttribute('data-state')).toBe('open')
      expect(content('getting-started').getAttribute('data-motion')).toBe('from-start')
      expect(content('components').getAttribute('data-motion')).toBe('to-end')
      expect(content('components').hasAttribute('hidden')).toBe(true)
    })
    expect(onValueChange).toHaveBeenLastCalledWith({ value: 'getting-started' })

    await userEvent.click(first)
    await vi.waitFor(() => expect(content('getting-started').hasAttribute('hidden')).toBe(true))
    await userEvent.click(page.getByRole('button', { name: /^Components/ }))
    await vi.waitFor(() => expect(content('components').hasAttribute('hidden')).toBe(false))
    expect(onValueChange).toHaveBeenLastCalledWith({ value: 'components' })
    expect(errors).not.toHaveBeenCalled()
    expect(warnings).not.toHaveBeenCalled()
  }
  finally {
    await cleanup()
    container.remove()
    errors.mockRestore()
    warnings.mockRestore()
  }
})

it('matches the core content contract for custom IDs, vertical RTL, and pointer handlers', () => {
  const machine = core.machine({
    id: 'contract-menu',
    defaultValue: 'components',
    orientation: 'vertical',
    dir: 'rtl',
    ids: { content: value => `custom-content-${value}` },
    getRootNode: () => document,
  })
  const serverSend = vi.fn()
  const clientSend = vi.fn()
  const beforeMount = connectNavigationMenu(machine.getState(), serverSend, false)
  const mounted = core.connect(machine.getState(), clientSend, normalizeProps)
  for (const value of ['getting-started', 'components']) {
    const serverProps = beforeMount.getContentProps({ value })
    const clientProps = mounted.getContentProps({ value })
    const attributes = (props: object) => Object.fromEntries(Object.entries(props).filter(([, value]) => typeof value !== 'function'))
    expect(attributes(serverProps)).toEqual(attributes(clientProps))
    expect(Object.keys(serverProps)).toEqual(Object.keys(clientProps))
    expect(beforeMount.getContentState({ value })).toEqual(mounted.getContentState({ value }))
    for (const [key, handler] of Object.entries(serverProps)) {
      if (!/pointer(?:enter|leave)/i.test(key) || typeof handler !== 'function')
        continue
      const event = new PointerEvent('pointerenter', { pointerType: 'mouse' })
      handler(event)
      const clientHandler = Object.entries(clientProps).find(([name]) => name === key)?.[1]
      if (typeof clientHandler === 'function')
        clientHandler(event)
    }
  }
  expect(serverSend.mock.calls).toEqual(clientSend.mock.calls)
  expect(serverSend.mock.calls.map(([event]) => event.type)).toEqual(['CONTENT_ENTER', 'CONTENT_LEAVE', 'CONTENT_ENTER', 'CONTENT_LEAVE'])
})

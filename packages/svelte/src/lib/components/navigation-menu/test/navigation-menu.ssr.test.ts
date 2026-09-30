import * as core from '@destyler/navigation-menu'
import { render } from 'svelte/server'
import { describe, expect, it, vi } from 'vitest'
import Basic from '../examples/Basic.svelte'
import { connectNavigationMenu } from '../hooks/connect-navigation-menu'
import SsrFixture from './SsrFixture.svelte'

const cases = [
  { name: 'closed', props: {}, value: null },
  { name: 'default', props: { defaultValue: 'components' }, value: 'components' },
  { name: 'live', props: { value: 'getting-started' }, value: 'getting-started' },
  { name: 'live over default', props: { value: 'getting-started', defaultValue: 'components' }, value: 'getting-started' },
  { name: 'null live over default', props: { value: null, defaultValue: 'components' }, value: null },
  { name: 'undefined live with default', props: { value: undefined, defaultValue: 'components' }, value: 'components' },
]

describe('navigationMenu full content SSR', () => {
  it.each(cases)('renders $name without browser globals', async ({ props, value }) => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
    const html = render(SsrFixture, { props: { id: 'ssr-navigation', ...props } }).body
    expect(html).toContain('How to install dependencies and structure your app.')
    expect(html).toContain('A modal dialog that interrupts the user with important content.')
    for (const itemValue of ['getting-started', 'components']) {
      const trigger = html.match(new RegExp(`<button[^>]*id="nav-menu:ssr-navigation:trigger:${itemValue}"[^>]*>`))?.[0]
      expect(trigger).toBeDefined()
      expect(trigger).toContain(`aria-expanded="${value === itemValue}"`)
      const content = html.match(new RegExp(`<div[^>]*id="nav-menu:ssr-navigation:content:${itemValue}"[^>]*>`))?.[0]
      expect(content).toBeDefined()
      expect(content).not.toContain('data-motion')
      expect(content).toContain(`data-state="${value === itemValue ? 'open' : 'closed'}"`)
      expect(/\shidden[=\s>]/.test(content!)).toBe(value !== itemValue)
    }
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
  })
})

describe('navigationMenu public hook and RootProvider SSR', () => {
  it.each(cases)('preserves $name through the public API', ({ props, value }) => {
    const html = render(SsrFixture, { props: { provider: true, id: 'ssr-provider', ...props } }).body
    expect(html).toContain('Provider content')
    expect(html).toContain(`data-value="${String(value)}"`)
    expect(html).toContain(`data-open="${value === 'components'}"`)
    expect(html).not.toContain('data-motion')
  })
})

it('keeps the complete server markup used by browser hydration in sync', async () => {
  expect(typeof window).toBe('undefined')
  expect(typeof document).toBe('undefined')
  const html = render(Basic, { props: { id: 'ssr-navigation', defaultValue: 'components', disableHoverTrigger: true } }).body
  await expect(html).toMatchFileSnapshot('./navigation-menu.ssr.html')
})

it('keeps custom content IDs, vertical orientation, RTL and public content state without reading DOM', () => {
  const getRootNode = vi.fn((): never => {
    throw new Error('Unexpected SSR DOM lookup')
  })
  const machine = core.machine({
    id: 'custom-menu',
    defaultValue: 'components',
    orientation: 'vertical',
    dir: 'rtl',
    ids: { content: value => `custom-content-${value}` },
    getRootNode,
  })
  const api = connectNavigationMenu(machine.getState(), vi.fn(), false)
  expect(api.getContentState({ value: 'components' })).toEqual({ open: true, motion: undefined })
  expect(api.getContentState({ value: 'getting-started' })).toEqual({ open: false, motion: undefined })
  for (const value of ['getting-started', 'components']) {
    expect(api.getContentProps({ value })).toMatchObject({
      'id': `custom-content-${value}`,
      'dir': 'rtl',
      'hidden': value !== 'components',
      'data-scope': 'navigation-menu',
      'data-part': 'content',
      'data-state': value === 'components' ? 'open' : 'closed',
      'data-value': value,
      'data-orientation': 'vertical',
    })
  }
  expect(getRootNode).not.toHaveBeenCalled()
})

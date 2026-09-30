import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { EnvironmentProvider } from '../../../providers/environment'
import { controlledMenu, entries, initialCases } from './fixtures/controlled-menu'

describe('navigationMenu controlled initialization in real Node SSR', () => {
  for (const entry of entries) {
    it.each(initialCases)(`${entry}: $name live value agrees with API and rendered parts`, async ({ modelValue, expected }) => {
      expect(typeof document).toBe('undefined')
      let api: any
      const fixture = controlledMenu(entry, { id: 'controlled-menu', modelValue, defaultValue: 'one' }, (value) => {
        api = value
      })
      const html = await renderToString(createSSRApp(() => h(EnvironmentProvider, {
        value() { throw new Error('SSR must not read the DOM') },
      }, () => h(fixture))))
      expect(api.value).toBe(expected)
      expect(api.open).toBe(Boolean(expected))
      expect(api.getViewportPositionerProps()['data-state']).toBe(expected ? 'open' : 'closed')
      expect(html).toContain(`data-open="${Boolean(expected)}"`)
      const outputValue = html.match(/<output[^>]*data-value(?:="([^"]*)")?/)
      expect(outputValue).not.toBeNull()
      expect(outputValue?.[1] ?? '').toBe(String(expected))
      const positioner = html.match(/<div[^>]*data-part="viewport-positioner"[^>]*>/)?.[0]
      expect(positioner).toContain(`data-state="${expected ? 'open' : 'closed'}"`)
      for (const value of ['one', 'two']) {
        const open = value === expected
        const trigger = html.match(new RegExp(`<button[^>]*id="nav-menu:controlled-menu:trigger:${value}"[^>]*>`))?.[0]
        const content = html.match(new RegExp(`<div[^>]*id="nav-menu:controlled-menu:content:${value}"[^>]*>`))?.[0]
        expect(api.getContentState({ value }).open).toBe(open)
        expect(trigger).toContain(`data-state="${open ? 'open' : 'closed'}"`)
        expect(trigger).toContain(`aria-expanded="${open}"`)
        expect(content).toContain(`data-state="${open ? 'open' : 'closed'}"`)
        expect(/\shidden[=\s>]/.test(content!)).toBe(!open)
      }
    })
  }
})

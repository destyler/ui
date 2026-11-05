import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import Basic from '../examples/Basic.svelte'
import ActionTriggerFixture from './ActionTriggerFixture.svelte'

describe('[timer] ActionTrigger server rendering', () => {
  it('does not leak any of the four actions into native button attributes', () => {
    const { body } = render(Basic)
    const buttons = body.match(/<button\b[^>]*>/g) ?? []
    expect(buttons).toHaveLength(4)
    for (const button of buttons) {
      expect(button).not.toMatch(/\saction=/)
      expect(button).toContain('type="button"')
    }
  })

  it.each([false, true])('preserves native/composed attributes (asChild=%s)', (asChild) => {
    const { body } = render(ActionTriggerFixture, { props: { asChild } })
    const button = body.match(/<button\b[^>]*>/)?.[0]
    expect(button).toBeDefined()
    expect(button).not.toMatch(/\saction=/)
    expect(button).toContain('type="button"')
    expect(button).toContain('class="timer-action"')
    expect(button).toContain('aria-label="Timer action"')
    expect(button).toContain('data-testid="trigger"')
    if (asChild)
      expect(button).toContain('data-child="true"')
  })
})

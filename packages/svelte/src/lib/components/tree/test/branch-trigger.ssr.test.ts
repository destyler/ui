import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import Basic from '../examples/Basic.svelte'
import BranchTriggerFixture from './BranchTriggerFixture.svelte'

describe('[tree] branch trigger SSR', () => {
  it('renders the default trigger as a div without an extra tab stop', () => {
    const { body } = render(Basic)
    const triggers = body.match(/<[^>]+data-part="branch-trigger"[^>]*>/g) ?? []

    expect(triggers).toHaveLength(3)
    for (const trigger of triggers) {
      expect(trigger).toMatch(/^<div\s/)
      expect(trigger).not.toContain('tabindex=')
    }
  })

  it('preserves explicit tabindex and caller attributes', () => {
    const { body } = render(BranchTriggerFixture, { props: { tabindex: 0 } })
    const trigger = body.match(/<[^>]+data-part="branch-trigger"[^>]*>/)?.[0]

    expect(trigger).toMatch(/^<div\s/)
    expect(trigger).toContain('tabindex="0"')
    expect(trigger).toContain('id="parent-trigger"')
    expect(trigger).toContain('data-parent="present"')
  })

  it('preserves an explicit asChild element without an extra wrapper', () => {
    const { body } = render(BranchTriggerFixture, { props: { asChild: true } })
    const triggers = body.match(/<[^>]+data-part="branch-trigger"[^>]*>/g) ?? []

    expect(triggers).toHaveLength(1)
    expect(triggers[0]).toMatch(/^<button\s/)
    expect(triggers[0]).toContain('type="button"')
    expect(triggers[0]).toContain('id="child-trigger"')
    expect(triggers[0]).toContain('class="parent-trigger child-trigger"')
    expect(triggers[0]).toContain('data-parent="present"')
    expect(triggers[0]).toContain('tabindex="-1"')
  })
})

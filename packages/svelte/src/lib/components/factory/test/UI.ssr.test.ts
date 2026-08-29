import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import TextareaFixture from './TextareaFixture.svelte'

describe('[factory] UI server rendering', () => {
  it('renders textarea values without hydration markers in the value', () => {
    const { body } = render(TextareaFixture)

    expect(body).toContain('value="Initial value"></textarea>')
    expect(body).not.toContain('<!---->')
  })
})

import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../normalize-props'

describe('normalizeProps', () => {
  it('preserves false values for ARIA state and native boolean props', () => {
    const props = normalizeProps.element({
      'aria-expanded': false,
      'aria-selected': false,
      'disabled': false,
    }) as Record<string, unknown>

    expect(props['aria-expanded']).toBe(false)
    expect(props['aria-selected']).toBe(false)
    expect(props.disabled).toBe(false)
  })
})

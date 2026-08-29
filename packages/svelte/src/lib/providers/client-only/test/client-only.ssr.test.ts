import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import { clientOnlySsrMarkup } from './client-only-ssr-markup'
import Fixture from './ClientOnlyFixture.svelte'

describe('[client-only] server rendering', () => {
  it('renders only the fallback before the component reaches the client', () => {
    const { body } = render(Fixture)

    expect(body).toBe(clientOnlySsrMarkup)
    expect(body).toContain('data-testid="fallback-slot"')
    expect(body).toContain('Fallback content')
    expect(body).not.toContain('data-testid="client-slot"')
    expect(body).not.toContain('Client content')
  })
})

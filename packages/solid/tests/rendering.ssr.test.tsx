import { renderToString } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { Checkbox } from '../src/components/checkbox'
import { ClientOnly } from '../src/providers/client-only'

describe('solid server rendering', () => {
  it('renders component markup without accessing browser globals', () => {
    const html = renderToString(() => (
      <Checkbox.Root defaultChecked>
        <Checkbox.Label>Accept terms</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
    ))

    expect(html).toContain('data-scope="checkbox"')
    expect(html).toContain('Accept terms')
  })

  it('renders the ClientOnly fallback on the server', () => {
    const html = renderToString(() => (
      <ClientOnly fallback={<span>Loading</span>}>
        <span>Browser only</span>
      </ClientOnly>
    ))

    expect(html).toContain('Loading')
    expect(html).not.toContain('Browser only')
  })
})

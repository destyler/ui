import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Fieldset } from '~/components/fieldset'
import { Field } from '../index'

describe.each(['field', 'fieldset'] as const)('%s server descriptions', (kind) => {
  it.each([false, true])('renders text without accessing the DOM (invalid=%s)', async (invalid) => {
    expect(typeof document).toBe('undefined')
    expect(typeof MutationObserver).toBe('undefined')
    const parts = kind === 'field' ? Field : Fieldset
    const html = await renderToString(createSSRApp({
      render: () => h(parts.Root, { id: 'server', invalid }, () => [
        h(parts.HelperText, null, () => 'Helper'),
        h(parts.ErrorText, null, () => 'Error'),
      ]),
    }))
    expect(html).toContain(`id="${kind}::server::helper-text"`)
    expect(html.includes(`id="${kind}::server::error-text"`)).toBe(invalid)
    // Presence is discovered on the client. This does not promise server linkage.
    expect(html).not.toMatch(/aria-describedby="[^"]+"/)
  })
})

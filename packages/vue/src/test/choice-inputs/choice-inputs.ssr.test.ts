import { describe, expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { ChoiceInputsFixture, families } from './ChoiceInputsFixture'
import serverMarkup from './server-markup.json'

describe.each(families)('%s hidden input server rendering', (family) => {
  it.each([false, true])('renders the genuine hydration fixture with asChild=%s', async (asChild) => {
    expect(typeof document).toBe('undefined')
    const onChange = vi.fn()
    const html = await renderToString(createSSRApp(ChoiceInputsFixture, { family, asChild, onChange }))
    expect(html).toBe(serverMarkup[`${family}-${asChild}`])
    expect(html).toMatch(/<input[^>]* checked/)
    expect(onChange).not.toHaveBeenCalled()
  })
})

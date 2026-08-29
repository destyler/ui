import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import IgnoreCase from '../examples/IgnoreCase.svelte'
import MatchAll from '../examples/MatchAll.svelte'
import Multiple from '../examples/Multiple.svelte'
import WithInput from '../examples/WithInput.svelte'

describe('[highlight] provider', () => {
  it('highlights a single query in text', async () => {
    const { container } = await render(Basic)
    const mark = container.querySelector('mark')
    expect(mark).not.toBeNull()
    expect(mark?.textContent).toBe('ipsum')
  })

  it('highlights multiple queries in text', async () => {
    const { container } = await render(Multiple)
    const marks = container.querySelectorAll('mark')
    expect(marks).toHaveLength(2)
    expect(Array.from(marks, mark => mark.textContent)).toEqual(expect.arrayContaining(['ipsum', 'amet']))
  })

  it('ignores case when ignoreCase is true', async () => {
    const { container } = await render(IgnoreCase)
    const marks = container.querySelectorAll('mark')
    expect(marks).toHaveLength(2)
    expect(Array.from(marks, mark => mark.textContent?.toLowerCase())).toEqual(expect.arrayContaining(['fox', 'dog']))
  })

  it('highlights all occurrences when matchAll is true', async () => {
    const { container } = await render(MatchAll)
    expect(container.querySelectorAll('mark').length).toBeGreaterThanOrEqual(2)
  })

  it('renders with input for dynamic search', async () => {
    const { container } = await render(WithInput)
    expect(container.querySelector('input')).not.toBeNull()
    expect(container.querySelector('mark')).not.toBeNull()
  })
})

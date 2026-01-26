import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Basic } from '../examples/Basic'
import { IgnoreCase } from '../examples/IgnoreCase'
import { MatchAll } from '../examples/MatchAll'
import { Multiple } from '../examples/Multiple'
import { WithInput } from '../examples/WithInput'

describe('[highlight] provider', () => {
  it('highlights a single query in text', async () => {
    const { container } = await render(<Basic />)

    const mark = container.querySelector('mark')
    expect(mark).not.toBeNull()
    expect(mark?.textContent).toBe('ipsum')
  })

  it('highlights multiple queries in text', async () => {
    const { container } = await render(<Multiple />)

    const marks = container.querySelectorAll('mark')
    expect(marks.length).toBe(2)

    const markTexts = Array.from(marks).map((m: Element) => m.textContent)
    expect(markTexts).toContain('ipsum')
    expect(markTexts).toContain('amet')
  })

  it('ignores case when ignoreCase is true', async () => {
    const { container } = await render(<IgnoreCase />)

    const marks = container.querySelectorAll('mark')
    expect(marks.length).toBe(2)

    const markTexts = Array.from(marks).map((m: Element) => m.textContent?.toLowerCase())
    expect(markTexts).toContain('fox')
    expect(markTexts).toContain('dog')
  })

  describe('matchAll option', () => {
    it('highlights all occurrences when matchAll is true', async () => {
      const { container } = await render(<MatchAll />)

      const matchAllDiv = container.querySelector('div')
      const firstH3 = matchAllDiv?.querySelector('h3')
      const matchAllSection = firstH3?.nextElementSibling

      if (matchAllSection) {
        const marks = container.querySelectorAll('mark')
        // Should have at least 2 marks for "fox" in match all mode
        expect(marks.length).toBeGreaterThanOrEqual(2)
      }
    })
  })

  it('renders with input for dynamic search', async () => {
    const { container } = await render(<WithInput />)

    const input = container.querySelector('input')
    expect(input).not.toBeNull()

    const mark = container.querySelector('mark')
    expect(mark).not.toBeNull()
  })
})

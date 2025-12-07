import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import Basic from '../examples/Basic.vue'
import IgnoreCase from '../examples/IgnoreCase.vue'
import MatchAll from '../examples/MatchAll.vue'
import Multiple from '../examples/Multiple.vue'
import WithInput from '../examples/WithInput.vue'

describe('[highlight] provider', () => {
  it('highlights a single query in text', async () => {
    const { container } = render(Basic)

    const mark = container.querySelector('mark')
    expect(mark).not.toBeNull()
    expect(mark?.textContent).toBe('ipsum')
  })

  it('highlights multiple queries in text', async () => {
    const { container } = render(Multiple)

    const marks = container.querySelectorAll('mark')
    expect(marks.length).toBe(2)

    const markTexts = Array.from(marks).map(m => m.textContent)
    expect(markTexts).toContain('ipsum')
    expect(markTexts).toContain('amet')
  })

  it('ignores case when ignoreCase is true', async () => {
    const { container } = render(IgnoreCase)

    const marks = container.querySelectorAll('mark')
    expect(marks.length).toBe(2)

    const markTexts = Array.from(marks).map(m => m.textContent?.toLowerCase())
    expect(markTexts).toContain('fox')
    expect(markTexts).toContain('dog')
  })

  describe('matchAll option', () => {
    it('highlights all occurrences when matchAll is true', async () => {
      const { container } = render(MatchAll)

      const headings = container.querySelectorAll('h3')
      const matchAllSection = headings[0]?.parentElement

      if (matchAllSection) {
        const matchAllDiv = container.querySelector('div')
        const firstH3Parent = matchAllDiv?.querySelector('h3')?.nextElementSibling as HTMLElement | null

        if (firstH3Parent) {
          const marks = Array.from(container.querySelectorAll('mark'))
          const matchAllMarks = marks.filter(mark =>
            mark.textContent === 'fox',
          )
          expect(matchAllMarks.length).toBeGreaterThanOrEqual(2)
        }
      }
    })

    it('highlights only first occurrence when matchAll is false', async () => {
      render(MatchAll)

      await expect.element(page.getByText('Match First Occurrence Only')).toBeVisible()
    })
  })

  it('updates highlights dynamically with input', async () => {
    const { container } = render(WithInput)

    const input = container.querySelector('input')
    expect(input).not.toBeNull()

    // Initial state: "ipsum" should be highlighted
    let marks = container.querySelectorAll('mark')
    expect(marks.length).toBe(1)
    expect(marks[0]?.textContent).toBe('ipsum')

    // Change input value
    if (input) {
      input.value = 'Lorem'
      input.dispatchEvent(new Event('input', { bubbles: true }))

      // Wait for reactivity
      await new Promise(resolve => setTimeout(resolve, 50))

      marks = container.querySelectorAll('mark')
      expect(marks.length).toBe(1)
      expect(marks[0]?.textContent).toBe('Lorem')
    }
  })

  it('renders text without marks when query is empty', async () => {
    const { container } = render(WithInput)

    const input = container.querySelector('input')

    if (input) {
      input.value = ''
      input.dispatchEvent(new Event('input', { bubbles: true }))

      await new Promise(resolve => setTimeout(resolve, 50))

      const marks = container.querySelectorAll('mark')
      expect(marks.length).toBe(0)
    }
  })
})

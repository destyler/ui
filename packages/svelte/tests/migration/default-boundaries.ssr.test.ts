import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import { entries, openFamilies } from './open-cases'
import OpenFixture from './open.fixture.svelte'
import UiDefaultsFixture from './ui-defaults.fixture.svelte'

function text(html: string, testId: string) {
  return html.match(new RegExp(`data-testid="${testId}"[^>]*>(.*?)</`))?.[1].replace(/<!--.*?-->/g, '')
}

describe.each(entries)('migration SSR: %s boundary', (entry) => {
  for (const family of openFamilies) {
    it.each([false, true])(`${family}: live open=%s overrides its conflicting default`, (open) => {
      const { body } = render(OpenFixture, { props: { family, entry, open, defaultOpen: !open } })
      expect(text(body, 'api-open')).toBe(String(open))
      expect(body).toContain(`data-state="${open ? 'open' : 'closed'}"`)
    })
  }

  it('seeds Calendar.defaultView before mount', () => {
    const { body } = render(UiDefaultsFixture, { props: { family: 'calendar', entry, defaultView: 'year' } })
    expect(text(body, 'api-view')).toBe('year')
    expect(body).toMatch(/<div[^>]*data-testid="year-view"[^>]*>Year view/)
    expect(body).not.toMatch(/<div[^>]*hidden[^>]*data-testid="year-view"/)
  })

  it('lets Calendar.view override defaultView', () => {
    const { body } = render(UiDefaultsFixture, { props: { family: 'calendar', entry, defaultView: 'year', view: 'month' } })
    expect(text(body, 'api-view')).toBe('month')
  })

  it('seeds Edit.defaultEdit before mount', () => {
    const { body } = render(UiDefaultsFixture, { props: { family: 'edit', entry, defaultEdit: true } })
    expect(text(body, 'api-editing')).toBe('true')
    expect(body).not.toMatch(/<input[^>]*hidden[^>]*data-testid="edit-input"/)
  })

  it.each([false, true])('lets Edit.edit=%s override defaultEdit', (edit) => {
    const { body } = render(UiDefaultsFixture, { props: { family: 'edit', entry, defaultEdit: !edit, edit } })
    expect(text(body, 'api-editing')).toBe(String(edit))
  })
})

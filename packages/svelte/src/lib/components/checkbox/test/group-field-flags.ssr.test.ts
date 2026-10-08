import { render } from 'svelte/server'
import { expect, it } from 'vitest'
import serverHtml from './group-field-flags.ssr.html?raw'
import Fixture from './GroupFieldFixture.svelte'

it('renders inherited field flags in a true server runtime', () => {
  expect(typeof document).toBe('undefined')
  const { body } = render(Fixture, { props: { initial: { field: { disabled: true, readOnly: true, invalid: true, required: true } } } })
  expect(body).toBe(serverHtml)
  expect(body).toMatch(/<input[^>]* disabled/)
  expect(body).toMatch(/<input[^>]* required/)
  expect(body).toMatch(/<input[^>]*aria-invalid="true"/)
  expect(body).toMatch(/data-scope="checkbox" data-part="root"[^>]*data-readonly=""/)
  expect(body).toContain('aria-labelledby="field::field::label"')
  expect(body).toContain('id="field::field::control"')
})

it('preserves explicit false during server rendering', () => {
  expect(typeof document).toBe('undefined')
  const { body } = render(Fixture, { props: { initial: { field: { disabled: true, readOnly: true, invalid: true }, group: { disabled: false, readOnly: false, invalid: false } } } })
  expect(body).not.toMatch(/<input[^>]* disabled/)
  expect(body).toMatch(/<input[^>]*aria-invalid="false"/)
})

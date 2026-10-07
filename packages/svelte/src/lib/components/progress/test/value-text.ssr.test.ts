import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import ValueTextSSR from './ValueTextSSR.svelte'

describe('progress value-text counterpart contracts', () => {
  it.each([true, false])('renders explicit zero or omitted children (showZero=%s)', (showZero) => {
    const { body } = render(ValueTextSSR, { props: { showZero } })
    expect(body.match(/<span\b[^>]*>(.*?)<\/span>/)?.[1].replace(/<!--.*?-->/g, '')).toBe(showZero ? '0' : '42%')
  })
})

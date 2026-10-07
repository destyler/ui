import { render } from 'svelte/server'
import { describe, it } from 'vitest'
import { assertStructuralMarkup } from '../../../utils/test/structural-markup'
import Fixture from './structural.fixture.svelte'

describe('structural family SSR contracts', () => {
  it.each([[2, false], [0.5, true]] as const)('renders ratio %s and vertical=%s', (ratio, vertical) => {
    const { body } = render(Fixture, { props: { ratio, vertical } })
    assertStructuralMarkup(body, ratio, vertical)
  })
})

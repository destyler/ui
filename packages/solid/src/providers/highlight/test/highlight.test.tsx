import { render } from '@solidjs/testing-library'
import { Highlight } from '../'

describe('highlight', () => {
  it('identifies the public package when text is invalid at runtime', () => {
    expect(() =>
      render(() => (
        <Highlight query="invalid" text={42 as unknown as string} />
      )),
    ).toThrow('[destyler-ui/highlight] text must be a string')
  })
})

import { renderToString } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { createToaster, Toaster } from '../src/components/toast'

describe('toast server rendering', () => {
  it('renders toaster groups with the public getGroupProps id', () => {
    function MultipleToasters() {
      const first = createToaster({ placement: 'bottom-end' })
      const second = createToaster({ placement: 'bottom-end' })

      return (
        <>
          <Toaster toaster={first}>{() => <div />}</Toaster>
          <Toaster toaster={second}>{() => <div />}</Toaster>
        </>
      )
    }

    const html = renderToString(() => <MultipleToasters />)
    const ids = [...html.matchAll(/id="(toast-group:bottom-end)"/g)]
      .map(match => match[1])

    expect(ids).toHaveLength(2)
    expect(ids.every(id => id === 'toast-group:bottom-end')).toBe(true)
  })
})

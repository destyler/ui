import { renderToString } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { createToaster, Toaster } from '../src/components/toast'

describe('toast server rendering', () => {
  it('renders multiple same-placement toaster groups with unique ids', () => {
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
    const ids = [...html.matchAll(/id="(toast-group:bottom-end:[^"]+)"/g)]
      .map(match => match[1])

    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })
})

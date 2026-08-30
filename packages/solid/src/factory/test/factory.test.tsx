import { render, screen } from '@solidjs/testing-library'
import { ui } from '../index'

describe('factory', () => {
  it('composes parent and child refs when rendering asChild', () => {
    let parentRef: HTMLButtonElement | undefined
    let childRef: HTMLButtonElement | undefined

    render(() => (
      <ui.button
        ref={element => (parentRef = element)}
        asChild={props => (
          <button
            {...props({
              ref: element => (childRef = element),
            })}
          >
            Open
          </button>
        )}
      />
    ))

    const button = screen.getByRole('button', { name: 'Open' })
    expect(parentRef).toBe(button)
    expect(childRef).toBe(button)
  })
})

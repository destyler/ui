import { render, screen, waitFor } from '@solidjs/testing-library'
import { createSignal, onCleanup } from 'solid-js'
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

  it('reacts when asChild changes', async () => {
    const [renderAsChild, setRenderAsChild] = createSignal(false)
    const cleanup = vi.fn()

    render(() => (
      <ui.button
        asChild={renderAsChild()
          ? (props) => {
              onCleanup(cleanup)
              return <a {...props()} href="#docs">Open docs</a>
            }
          : undefined}
      >
        Open docs
      </ui.button>
    ))

    expect(screen.getByRole('button', { name: 'Open docs' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Open docs' })).not.toBeInTheDocument()

    setRenderAsChild(true)
    await waitFor(() => expect(screen.getByRole('link', { name: 'Open docs' })).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: 'Open docs' })).not.toBeInTheDocument()

    setRenderAsChild(false)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open docs' })).toBeInTheDocument())
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('merges parent and child classList values when rendering asChild', () => {
    render(() => (
      <ui.div
        classList={{ parent: true, shared: true }}
        asChild={props => (
          <span {...props({ classList: { child: true, shared: false } })}>
            Merged classes
          </span>
        )}
      />
    ))

    const element = screen.getByText('Merged classes')
    expect(element).toHaveClass('parent', 'child')
    expect(element).not.toHaveClass('shared')
  })
})

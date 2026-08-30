import { render, screen } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Toggle, toggleAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'

function ComponentUnderTest() {
  return (
    <Toggle.Root aria-label="Bold">
      Bold
      <Toggle.Indicator>Enabled</Toggle.Indicator>
    </Toggle.Root>
  )
}

describe('toggle', () => {
  it.each(getParts(toggleAnatomy))('renders part %s', (part) => {
    render(() => <ComponentUnderTest />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(toggleAnatomy))('exports %s', (part) => {
    expect(Toggle[part]).toBeDefined()
  })

  it('changes pressed state when clicked', async () => {
    render(() => <ComponentUnderTest />)
    const button = screen.getByRole('button', { name: 'Bold' })
    expect(button).toHaveAttribute('data-state', 'off')
    await user.click(button)
    expect(button).toHaveAttribute('data-state', 'on')
    expect(screen.getByText('Enabled')).toBeVisible()
  })

  it('reacts to disabled prop changes', async () => {
    const [disabled, setDisabled] = createSignal(false)
    render(() => (
      <>
        <button onClick={() => setDisabled(true)}>Disable toggle</button>
        <Toggle.Root aria-label="Bold" disabled={disabled()}>
          Bold
          <Toggle.Indicator>Enabled</Toggle.Indicator>
        </Toggle.Root>
      </>
    ))

    const button = screen.getByRole('button', { name: 'Bold' })
    const indicator = document.querySelector<HTMLElement>('[data-part="indicator"]')!
    await user.click(button)
    expect(button).toHaveAttribute('data-state', 'on')

    await user.click(screen.getByRole('button', { name: 'Disable toggle' }))
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-disabled')
    expect(indicator).toHaveAttribute('data-disabled')

    await user.click(button)
    expect(button).toHaveAttribute('data-state', 'on')
  })

  it('uses the latest onPressedChange callback', async () => {
    const firstHandler = vi.fn()
    const secondHandler = vi.fn()
    const [handler, setHandler] = createSignal(firstHandler)
    render(() => (
      <>
        <button onClick={() => setHandler(() => secondHandler)}>Replace handler</button>
        <Toggle.Root aria-label="Bold" onPressedChange={handler()}>
          Bold
        </Toggle.Root>
      </>
    ))

    await user.click(screen.getByRole('button', { name: 'Replace handler' }))
    await user.click(screen.getByRole('button', { name: 'Bold' }))

    expect(firstHandler).not.toHaveBeenCalled()
    expect(secondHandler).toHaveBeenCalledWith(true)
  })

  it('supports rendering the root as a child element', async () => {
    render(() => (
      <Toggle.Root
        asChild={parentProps => (
          <a {...parentProps({})} href="#bold" role="button">
            Bold link
          </a>
        )}
      />
    ))

    const link = screen.getByRole('button', { name: 'Bold link' })
    expect(link.tagName).toBe('A')

    await user.click(link)
    expect(link).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps indicator children, fallback, and attributes reactive', async () => {
    const [children, setChildren] = createSignal('Enabled')
    const [fallback, setFallback] = createSignal('Disabled')
    const [title, setTitle] = createSignal('Initial title')
    render(() => (
      <>
        <button
          onClick={() => {
            setChildren('Active')
            setFallback('Inactive')
            setTitle('Updated title')
          }}
        >
          Update indicator
        </button>
        <Toggle.Root aria-label="Bold">
          <Toggle.Indicator title={title()} fallback={fallback()}>
            {children()}
          </Toggle.Indicator>
        </Toggle.Root>
      </>
    ))

    const indicator = document.querySelector<HTMLElement>('[data-part="indicator"]')!
    expect(indicator).toHaveTextContent('Disabled')
    expect(indicator).toHaveAttribute('title', 'Initial title')

    await user.click(screen.getByRole('button', { name: 'Update indicator' }))
    expect(indicator).toHaveTextContent('Inactive')
    expect(indicator).toHaveAttribute('title', 'Updated title')

    await user.click(screen.getByRole('button', { name: 'Bold' }))
    expect(indicator).toHaveTextContent('Active')
  })
})

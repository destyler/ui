import { render, screen } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
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
})

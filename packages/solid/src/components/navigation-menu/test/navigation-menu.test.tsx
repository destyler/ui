import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { NavigationMenu, navigationMenuAnatomy } from '..'
import { getExports, getParts } from '../../../setup-test'
import { Basic } from '../examples/Basic'
import { Controlled } from '../examples/Controlled'
import { RootProvider } from '../examples/RootProvider'

const installationText = 'How to install dependencies and structure your app.'

describe('navigationMenu / Parts & Exports', () => {
  const renderedParts = getParts(navigationMenuAnatomy).filter(
    part => !part.includes('[data-part="item-indicator"]'),
  )

  it.each(renderedParts)('should render part %s', (part) => {
    render(() => <Basic openDelay={0} closeDelay={0} />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(navigationMenuAnatomy))('should export %s', (part) => {
    expect(NavigationMenu[part]).toBeDefined()
  })
})

describe('navigationMenu', () => {
  it('renders triggers and a direct link while content starts hidden', () => {
    render(() => <Basic />)
    expect(screen.getByRole('button', { name: 'Getting started' })).toBeVisible()
    expect(screen.getByRole('button', { name: /^Components/ })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Documentation' })).toBeVisible()
    expect(screen.getByText(installationText)).not.toBeVisible()
  })

  it('opens on click and reports value changes', async () => {
    const onValueChange = vi.fn()
    render(() => (
      <Basic
        onValueChange={onValueChange}
        disableHoverTrigger
        openDelay={0}
        closeDelay={0}
      />
    ))

    const trigger = screen.getByRole('button', { name: 'Getting started' })
    fireEvent.click(trigger)

    await waitFor(() => expect(screen.getByText(installationText)).toBeVisible())
    expect(onValueChange).toHaveBeenCalledWith({ value: 'getting-started' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('supports default and controlled values', async () => {
    const defaultValue = render(() => (
      <Basic defaultValue="components" openDelay={0} closeDelay={0} />
    ))
    await waitFor(() =>
      expect(screen.getByText('A modal dialog that interrupts the user with important content.')).toBeVisible(),
    )
    defaultValue.unmount()

    render(() => <Controlled />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Components' }))
    await waitFor(() => expect(screen.getByText('Current value: components')).toBeVisible())
    await waitFor(() => expect(screen.getByText('Dialog')).toBeVisible())
  })

  it('inherits trigger and link values from their item', async () => {
    render(() => (
      <NavigationMenu.Root disableHoverTrigger openDelay={0} closeDelay={0}>
        <NavigationMenu.List>
          <NavigationMenu.Item value="inherited">
            <NavigationMenu.Trigger>Inherited trigger</NavigationMenu.Trigger>
            <NavigationMenu.Link href="#inherited">Inherited link</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.ViewportPositioner>
          <NavigationMenu.Viewport>
            <NavigationMenu.Content value="inherited">Inherited content</NavigationMenu.Content>
          </NavigationMenu.Viewport>
        </NavigationMenu.ViewportPositioner>
      </NavigationMenu.Root>
    ))

    const trigger = screen.getByRole('button', { name: 'Inherited trigger' })
    expect(trigger).toHaveAttribute('data-value', 'inherited')
    expect(screen.getByRole('link', { name: 'Inherited link' })).toHaveAttribute(
      'id',
      expect.stringMatching(/:link:inherited$/),
    )
    fireEvent.click(trigger)
    await waitFor(() => expect(screen.getByText('Inherited content')).toBeVisible())
  })

  it('lets an explicit presence value override the machine state', async () => {
    render(() => (
      <Basic
        defaultValue="getting-started"
        present={false}
        openDelay={0}
        closeDelay={0}
      />
    ))
    const content = screen.getByText(installationText).closest('[data-part="content"]')
    expect(content).not.toBeNull()
    await waitFor(() => expect(content).not.toBeVisible())
    expect(content).toHaveAttribute('data-state', 'closed')
  })

  it('works through RootProvider', async () => {
    render(() => <RootProvider />)
    await waitFor(() => expect(screen.getByText('Installation')).toBeVisible())
  })
})

import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { createSignal, Show } from 'solid-js'
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

  it('keeps the previous content visible while switching default values', async () => {
    const onExitComplete = vi.fn()

    function SwitchingNavigationMenu() {
      return (
        <NavigationMenu.Root
          defaultValue="first"
          immediate
          lazyMount
          unmountOnExit
          onExitComplete={onExitComplete}
        >
          <NavigationMenu.Context>
            {api => (
              <>
                <button type="button" onClick={() => api().setValue('second')}>
                  Open second content
                </button>
                <NavigationMenu.Content
                  value="first"
                  data-testid="first-navigation-content"
                  style={{
                    'animation-name': api().value === 'first' ? 'navigation-enter' : 'navigation-exit',
                    'animation-duration': '60s',
                  }}
                >
                  First content
                </NavigationMenu.Content>
                <NavigationMenu.Content value="second" data-testid="second-navigation-content">
                  Second content
                </NavigationMenu.Content>
              </>
            )}
          </NavigationMenu.Context>
        </NavigationMenu.Root>
      )
    }

    render(() => <SwitchingNavigationMenu />)

    const firstContent = screen.getByTestId('first-navigation-content')
    expect(firstContent).toBeVisible()
    expect(screen.queryByTestId('second-navigation-content')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Open second content' }))
    await waitFor(() => expect(screen.getByTestId('second-navigation-content')).toBeVisible())

    expect(firstContent).toBeVisible()
    expect(firstContent).toHaveAttribute('data-state', 'closed')
    expect(onExitComplete).not.toHaveBeenCalled()

    await new Promise(resolve => setTimeout(resolve, 0))
    fireEvent.animationEnd(firstContent)
    await waitFor(() => expect(screen.queryByTestId('first-navigation-content')).not.toBeInTheDocument())
    expect(onExitComplete).not.toHaveBeenCalled()
  })

  it('tracks viewport and indicator exit animations independently', async () => {
    const onExitComplete = vi.fn()

    render(() => (
      <NavigationMenu.Root
        defaultValue="first"
        immediate
        unmountOnExit
        onExitComplete={onExitComplete}
      >
        <NavigationMenu.Context>
          {api => (
            <>
              <button type="button" onClick={() => api().setValue(null)}>Close menu</button>
              <NavigationMenu.Viewport
                data-testid="animated-navigation-viewport"
                style={{
                  'animation-name': api().value !== null ? 'viewport-enter' : 'viewport-exit',
                  'animation-duration': '60s',
                }}
              />
              <NavigationMenu.Indicator
                data-testid="animated-navigation-indicator"
                style={{
                  'animation-name': api().value !== null ? 'indicator-enter' : 'indicator-exit',
                  'animation-duration': '60s',
                }}
              />
            </>
          )}
        </NavigationMenu.Context>
      </NavigationMenu.Root>
    ))

    const viewport = screen.getByTestId('animated-navigation-viewport')
    const indicator = screen.getByTestId('animated-navigation-indicator')
    expect(viewport).toBeVisible()
    expect(indicator).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    await Promise.resolve()
    expect(viewport).toBeVisible()
    expect(indicator).toBeVisible()
    expect(onExitComplete).not.toHaveBeenCalled()

    await new Promise(resolve => setTimeout(resolve, 0))
    fireEvent.animationEnd(viewport)
    await waitFor(() => expect(screen.queryByTestId('animated-navigation-viewport')).not.toBeInTheDocument())
    expect(indicator).toBeInTheDocument()
    expect(onExitComplete).not.toHaveBeenCalled()

    fireEvent.animationEnd(indicator)
    await waitFor(() => expect(screen.queryByTestId('animated-navigation-indicator')).not.toBeInTheDocument())
    await waitFor(() => expect(onExitComplete).toHaveBeenCalledOnce())
  })

  it('does not wait on a detached active content when closing', async () => {
    const onExitComplete = vi.fn()

    function DynamicallyMountedNavigationMenu() {
      const [showContent, setShowContent] = createSignal(true)

      return (
        <NavigationMenu.Root
          defaultValue="first"
          immediate
          unmountOnExit
          onExitComplete={onExitComplete}
        >
          <NavigationMenu.Context>
            {api => (
              <>
                <button type="button" onClick={() => setShowContent(false)}>Unmount content</button>
                <button type="button" onClick={() => api().setValue(null)}>Close menu</button>
                <Show when={showContent()}>
                  <NavigationMenu.Content
                    value="first"
                    data-testid="dynamic-navigation-content"
                    style={{
                      'animation-name': api().value !== null ? 'navigation-enter' : 'navigation-exit',
                      'animation-duration': '60s',
                    }}
                  >
                    Dynamic content
                  </NavigationMenu.Content>
                </Show>
              </>
            )}
          </NavigationMenu.Context>
        </NavigationMenu.Root>
      )
    }

    render(() => <DynamicallyMountedNavigationMenu />)
    expect(screen.getByTestId('dynamic-navigation-content')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Unmount content' }))
    expect(screen.queryByTestId('dynamic-navigation-content')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    await waitFor(() => expect(onExitComplete).toHaveBeenCalledOnce())
  })

  it('keeps controlled content visible while its exit animation runs', async () => {
    const onExitComplete = vi.fn()

    function ControlledAnimatedNavigationMenu() {
      const [value, setValue] = createSignal<string | null>('first')

      return (
        <>
          <button type="button" onClick={() => setValue(null)}>Close controlled menu</button>
          <NavigationMenu.Root
            value={value()}
            immediate
            unmountOnExit
            onExitComplete={onExitComplete}
          >
            <NavigationMenu.Content
              value="first"
              data-testid="controlled-navigation-content"
              style={{
                'animation-name': value() !== null ? 'navigation-enter' : 'navigation-exit',
                'animation-duration': '60s',
              }}
            >
              Controlled content
            </NavigationMenu.Content>
          </NavigationMenu.Root>
        </>
      )
    }

    render(() => <ControlledAnimatedNavigationMenu />)

    const content = screen.getByTestId('controlled-navigation-content')
    expect(content).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Close controlled menu' }))
    await Promise.resolve()
    expect(onExitComplete).not.toHaveBeenCalled()
    expect(content).toBeInTheDocument()
    expect(content).toBeVisible()

    await new Promise(resolve => setTimeout(resolve, 0))
    fireEvent.animationEnd(content)
    await waitFor(() => expect(onExitComplete).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.queryByTestId('controlled-navigation-content')).not.toBeInTheDocument())
  })

  it('forwards viewport and indicator refs', () => {
    let viewport: HTMLDivElement | undefined
    let indicator: HTMLDivElement | undefined

    render(() => (
      <NavigationMenu.Root defaultValue="first">
        <NavigationMenu.Viewport ref={node => (viewport = node)} />
        <NavigationMenu.Indicator ref={node => (indicator = node)} />
      </NavigationMenu.Root>
    ))

    expect(viewport).toBe(screen.getByRole('navigation').querySelector('[data-part="viewport"]'))
    expect(indicator).toBe(screen.getByRole('navigation').querySelector('[data-part="indicator"]'))
  })
})

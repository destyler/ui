import type { UseNavigationMenuProps } from '../src/components/navigation-menu'
import { cleanup, render, waitFor } from '@solidjs/testing-library'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NavigationMenu, useNavigationMenu } from '../src/components/navigation-menu'

afterEach(cleanup)

const cases = [
  { name: 'explicit null over default', props: { value: null, defaultValue: 'one' }, value: null },
  { name: 'live over empty default', props: { value: 'one', defaultValue: '' }, value: 'one' },
  { name: 'live over another default', props: { value: 'one', defaultValue: 'two' }, value: 'one' },
  { name: 'undefined with a default', props: { value: undefined, defaultValue: 'one' }, value: 'one' },
]

describe.each(['root', 'provider', 'hook'] as const)('navigation menu initialization through %s', (boundary) => {
  it.each(cases)('keeps $name consistent before and after mount', async ({ props, value }) => {
    let api!: ReturnType<typeof useNavigationMenu>
    const onValueChange = vi.fn()
    let initial: { value: string | null, open: boolean } | undefined
    const capture = (context: ReturnType<typeof useNavigationMenu>) => {
      api = context
      initial = { value: api().value, open: api().open }
      return null
    }
    const parts = () => (
      <>
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger data-testid="trigger">One</NavigationMenu.Trigger>
            <NavigationMenu.Content data-testid="content">Content</NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.ViewportPositioner data-testid="positioner">
          <NavigationMenu.Viewport data-testid="viewport" />
        </NavigationMenu.ViewportPositioner>
      </>
    )
    const view = render(() => {
      const machineProps: UseNavigationMenuProps = { id: 'live-menu', ...props, onValueChange }
      if (boundary === 'root') {
        return (
          <NavigationMenu.Root {...machineProps}>
            <NavigationMenu.Context>{capture}</NavigationMenu.Context>
            {parts()}
          </NavigationMenu.Root>
        )
      }
      api = useNavigationMenu(machineProps)
      capture(api)
      if (boundary === 'provider')
        return <NavigationMenu.RootProvider value={api}>{parts()}</NavigationMenu.RootProvider>
      return (
        <nav {...api().getRootProps()}>
          <button data-testid="trigger" {...api().getTriggerProps({ value: 'one' })}>One</button>
          <div data-testid="content" {...api().getContentProps({ value: 'one' })}>Content</div>
          <div data-testid="positioner" {...api().getViewportPositionerProps()}>
            <div data-testid="viewport" {...api().getViewportProps()} />
          </div>
        </nav>
      )
    })
    expect(initial).toEqual({ value, open: value !== null })
    await waitFor(() => {
      expect(api().value).toBe(value)
      expect(api().open).toBe(value !== null)
      expect(view.getByTestId('trigger')).toHaveAttribute('aria-expanded', String(value === 'one'))
      for (const part of ['content', 'positioner', 'viewport'])
        expect(view.getByTestId(part)).toHaveAttribute('data-state', value !== null ? 'open' : 'closed')
      expect(view.getByTestId('content').hidden).toBe(value === null)
    })
    expect(onValueChange).not.toHaveBeenCalled()
  })
})

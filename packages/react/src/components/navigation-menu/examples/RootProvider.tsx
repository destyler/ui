import { NavigationMenu, useNavigationMenu } from '../index'

function NavigationMenuDemo() {
  const navigationMenu = useNavigationMenu({ defaultValue: 'getting-started' })

  return (
    <NavigationMenu.RootProvider value={navigationMenu}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="getting-started">
          <NavigationMenu.Trigger value="getting-started">
            Getting started
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="components">
          <NavigationMenu.Trigger value="components">
            Components
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator>
          <NavigationMenu.Arrow />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <NavigationMenu.ViewportPositioner>
        <NavigationMenu.Viewport>
          <NavigationMenu.Content value="getting-started">
            <NavigationMenu.Link value="intro" href="#">Introduction</NavigationMenu.Link>
            <NavigationMenu.Link value="install" href="#">Installation</NavigationMenu.Link>
          </NavigationMenu.Content>

          <NavigationMenu.Content value="components">
            <NavigationMenu.Link value="button" href="#">Button</NavigationMenu.Link>
            <NavigationMenu.Link value="dialog" href="#">Dialog</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Viewport>
      </NavigationMenu.ViewportPositioner>
    </NavigationMenu.RootProvider>
  )
}

export function RootProvider() {
  return <NavigationMenuDemo />
}

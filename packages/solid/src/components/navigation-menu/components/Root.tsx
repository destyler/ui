import type { UseNavigationMenuProps } from '../hooks/use-navigation-menu'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { splitPresenceProps } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useNavigationMenu } from '../hooks/use-navigation-menu'
import { NavigationMenuProvider } from '../hooks/use-navigation-menu-context'
import {
  createNavigationMenuPresence,
  NavigationMenuPresenceProvider,
} from '../hooks/use-navigation-menu-presence'

export interface NavigationMenuRootBaseProps
  extends UseNavigationMenuProps,
  UsePresenceProps,
  PolymorphicProps<'nav'> {}
export interface NavigationMenuRootProps
  extends Assign<HTMLProps<'nav'>, NavigationMenuRootBaseProps> {}

export function NavigationMenuRoot(props: NavigationMenuRootProps) {
  const [presenceProps, navigationMenuProps] = splitPresenceProps(props)
  const [useNavigationMenuProps, localProps]
    = createSplitProps<UseNavigationMenuProps>()(navigationMenuProps, [
      'closeDelay',
      'defaultValue',
      'disableClickTrigger',
      'disableHoverTrigger',
      'disablePointerLeaveClose',
      'id',
      'ids',
      'onValueChange',
      'openDelay',
      'orientation',
      'value',
    ])
  const navigationMenu = useNavigationMenu(useNavigationMenuProps)
  const presence = createNavigationMenuPresence(
    presenceProps,
    () => navigationMenu().value !== null,
  )
  const mergedProps = mergeProps(
    () => navigationMenu().getRootProps(),
    localProps,
  )

  return (
    <NavigationMenuProvider value={navigationMenu}>
      <NavigationMenuPresenceProvider value={presence}>
        <ui.nav {...mergedProps} />
      </NavigationMenuPresenceProvider>
    </NavigationMenuProvider>
  )
}

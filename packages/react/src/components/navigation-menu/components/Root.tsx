import type { UseNavigationMenuProps } from '../hooks/use-navigation-menu'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useNavigationMenu } from '../hooks/use-navigation-menu'
import { NavigationMenuProvider } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuRootBaseProps extends UseNavigationMenuProps, UsePresenceProps, PolymorphicProps {}
export interface NavigationMenuRootProps extends Assign<HTMLProps<'nav'>, NavigationMenuRootBaseProps> {}

export const NavigationMenuRoot = forwardRef<HTMLElement, NavigationMenuRootProps>((props, ref) => {
  const [presenceProps, navigationMenuProps] = splitPresenceProps(props)
  const [useNavigationMenuProps, localProps] = createSplitProps<UseNavigationMenuProps>()(navigationMenuProps, [
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
  const presence = usePresence(mergeProps({ present: navigationMenu.open }, presenceProps))
  const mergedProps = mergeProps(navigationMenu.getRootProps(), localProps)

  return (
    <NavigationMenuProvider value={navigationMenu}>
      <PresenceProvider value={presence}>
        <ui.nav {...mergedProps} ref={ref} />
      </PresenceProvider>
    </NavigationMenuProvider>
  )
})

NavigationMenuRoot.displayName = 'NavigationMenuRoot'

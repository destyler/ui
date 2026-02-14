import type { UseNavigationMenuReturn } from '../hooks/use-navigation-menu'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { NavigationMenuProvider } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuRootProviderBaseProps extends UsePresenceProps, PolymorphicProps {
  value: UseNavigationMenuReturn
}

export interface NavigationMenuRootProviderProps
  extends Assign<HTMLProps<'nav'>, NavigationMenuRootProviderBaseProps> {}

export const NavigationMenuRootProvider = forwardRef<HTMLElement, NavigationMenuRootProviderProps>(
  (props, ref) => {
    const { value: navigationMenu, ...localProps } = props
    const [presenceProps, restProps] = splitPresenceProps(localProps)
    const presence = usePresence(mergeProps({ present: navigationMenu.open }, presenceProps))
    const mergedProps = mergeProps(navigationMenu.getRootProps(), restProps)

    return (
      <NavigationMenuProvider value={navigationMenu}>
        <PresenceProvider value={presence}>
          <ui.nav {...mergedProps} ref={ref} />
        </PresenceProvider>
      </NavigationMenuProvider>
    )
  },
)

NavigationMenuRootProvider.displayName = 'NavigationMenuRootProvider'

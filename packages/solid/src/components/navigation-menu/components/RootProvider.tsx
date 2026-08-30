import type { UseNavigationMenuReturn } from '../hooks/use-navigation-menu'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,
} from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { NavigationMenuProvider } from '../hooks/use-navigation-menu-context'

interface RootProviderProps {
  value: UseNavigationMenuReturn
}

export interface NavigationMenuRootProviderBaseProps
  extends RootProviderProps,
  UsePresenceProps,
  PolymorphicProps<'nav'> {}
export interface NavigationMenuRootProviderProps
  extends Assign<HTMLProps<'nav'>, NavigationMenuRootProviderBaseProps> {}

export function NavigationMenuRootProvider(props: NavigationMenuRootProviderProps) {
  const [presenceProps, navigationMenuProps] = splitPresenceProps(props)
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(
    navigationMenuProps,
    ['value'],
  )
  const navigationMenu: UseNavigationMenuReturn = () => providerProps.value()
  const presence = usePresence(
    mergeProps(() => ({ present: navigationMenu().open }), presenceProps),
  )
  const mergedProps = mergeProps(
    () => navigationMenu().getRootProps(),
    localProps,
  )

  return (
    <NavigationMenuProvider value={navigationMenu}>
      <PresenceProvider value={presence}>
        <ui.nav {...mergedProps} />
      </PresenceProvider>
    </NavigationMenuProvider>
  )
}

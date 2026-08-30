import type { ItemProps } from '@destyler/navigation-menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'
import { NavigationMenuItemPropsProvider } from '../hooks/use-navigation-menu-item-props-context'

export interface NavigationMenuItemBaseProps
  extends ItemProps,
  PolymorphicProps<'li'> {}
export interface NavigationMenuItemProps
  extends Assign<HTMLProps<'li'>, NavigationMenuItemBaseProps> {}

export function NavigationMenuItem(props: NavigationMenuItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value'])
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = mergeProps(
    () => navigationMenu().getItemProps(itemProps),
    localProps,
  )

  return (
    <NavigationMenuItemPropsProvider value={() => itemProps}>
      <ui.li {...mergedProps} />
    </NavigationMenuItemPropsProvider>
  )
}

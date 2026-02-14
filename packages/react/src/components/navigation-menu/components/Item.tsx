import type { ItemProps } from '@destyler/navigation-menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuItemBaseProps extends ItemProps, PolymorphicProps {}
export interface NavigationMenuItemProps extends Omit<HTMLProps<'li'>, 'value'>, NavigationMenuItemBaseProps {}

export const NavigationMenuItem = forwardRef<HTMLLIElement, NavigationMenuItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value'])
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = mergeProps(navigationMenu.getItemProps(itemProps), localProps)

  return <ui.li {...mergedProps} ref={ref} />
})

NavigationMenuItem.displayName = 'NavigationMenuItem'

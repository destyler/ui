import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuListBaseProps extends PolymorphicProps {}
export interface NavigationMenuListProps extends HTMLProps<'ul'>, NavigationMenuListBaseProps {}

export const NavigationMenuList = forwardRef<HTMLUListElement, NavigationMenuListProps>((props, ref) => {
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = mergeProps(navigationMenu.getListProps(), props)

  return <ui.ul {...mergedProps} ref={ref} />
})

NavigationMenuList.displayName = 'NavigationMenuList'

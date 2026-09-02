import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuListBaseProps extends PolymorphicProps<'ul'> {}
export interface NavigationMenuListProps
  extends HTMLProps<'ul'>,
  NavigationMenuListBaseProps {}

export function NavigationMenuList(props: NavigationMenuListProps) {
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = mergeProps(() => navigationMenu().getListProps(), props)

  return <ui.ul {...mergedProps} />
}

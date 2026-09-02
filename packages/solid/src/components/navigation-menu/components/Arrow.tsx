import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuArrowBaseProps extends PolymorphicProps<'div'> {}
export interface NavigationMenuArrowProps
  extends HTMLProps<'div'>,
  NavigationMenuArrowBaseProps {}

export function NavigationMenuArrow(props: NavigationMenuArrowProps) {
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = mergeProps(() => navigationMenu().getArrowProps(), props)

  return <ui.div {...mergedProps} />
}

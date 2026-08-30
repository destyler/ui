import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuViewportPositionerBaseProps
  extends PolymorphicProps<'div'> {}
export interface NavigationMenuViewportPositionerProps
  extends HTMLProps<'div'>,
  NavigationMenuViewportPositionerBaseProps {}

export function NavigationMenuViewportPositioner(props: NavigationMenuViewportPositionerProps) {
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = mergeProps(
    () => navigationMenu().getViewportPositionerProps(),
    props,
  )

  return <ui.div {...mergedProps} />
}

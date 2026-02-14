import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuArrowBaseProps extends PolymorphicProps {}
export interface NavigationMenuArrowProps extends HTMLProps<'div'>, NavigationMenuArrowBaseProps {}

export const NavigationMenuArrow = forwardRef<HTMLDivElement, NavigationMenuArrowProps>((props, ref) => {
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = mergeProps(navigationMenu.getArrowProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

NavigationMenuArrow.displayName = 'NavigationMenuArrow'

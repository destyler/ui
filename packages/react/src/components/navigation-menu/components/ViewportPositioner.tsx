import type { HTMLProps, PolymorphicProps } from '~/factory'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuViewportPositionerBaseProps extends PolymorphicProps {}
export interface NavigationMenuViewportPositionerProps extends HTMLProps<'div'>, NavigationMenuViewportPositionerBaseProps {}

export const NavigationMenuViewportPositioner = forwardRef<HTMLDivElement, NavigationMenuViewportPositionerProps>((props, ref) => {
  const navigationMenu = useNavigationMenuContext()
  const presence = usePresenceContext()
  const mergedProps = { ...navigationMenu.getViewportPositionerProps(), ...props }

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

NavigationMenuViewportPositioner.displayName = 'NavigationMenuViewportPositioner'

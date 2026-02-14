import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuViewportBaseProps extends PolymorphicProps {}
export interface NavigationMenuViewportProps extends HTMLProps<'div'>, NavigationMenuViewportBaseProps {}

export const NavigationMenuViewport = forwardRef<HTMLDivElement, NavigationMenuViewportProps>((props, ref) => {
  const navigationMenu = useNavigationMenuContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    navigationMenu.getViewportProps(),
    presence.getPresenceProps(),
    props,
  )

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composeRefs(presence.ref, ref)} />
})

NavigationMenuViewport.displayName = 'NavigationMenuViewport'

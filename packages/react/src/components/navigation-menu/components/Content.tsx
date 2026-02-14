import type { ContentProps } from '@destyler/navigation-menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuContentBaseProps extends ContentProps, PolymorphicProps {}
export interface NavigationMenuContentProps extends HTMLProps<'div'>, NavigationMenuContentBaseProps {}

export const NavigationMenuContent = forwardRef<HTMLDivElement, NavigationMenuContentProps>((props, ref) => {
  const { value, ...restProps } = props
  const navigationMenu = useNavigationMenuContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(navigationMenu.getContentProps({ value }), presence.getPresenceProps(), restProps)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composeRefs(presence.ref, ref)} />
})

NavigationMenuContent.displayName = 'NavigationMenuContent'

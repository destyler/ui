import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useComposedRefs } from '~/utils/compose-refs'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuIndicatorBaseProps extends PolymorphicProps {}
export interface NavigationMenuIndicatorProps extends HTMLProps<'div'>, NavigationMenuIndicatorBaseProps {}

export const NavigationMenuIndicator = forwardRef<HTMLDivElement, NavigationMenuIndicatorProps>((props, ref) => {
  const navigationMenu = useNavigationMenuContext()
  const presence = usePresenceContext()
  const composedRef = useComposedRefs(presence.ref, ref)
  const mergedProps = mergeProps(
    navigationMenu.getIndicatorProps(),
    presence.getPresenceProps(),
    props,
  )

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composedRef} />
})

NavigationMenuIndicator.displayName = 'NavigationMenuIndicator'

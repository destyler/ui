import type { LinkProps } from '@destyler/navigation-menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuLinkBaseProps extends LinkProps, PolymorphicProps {}
export interface NavigationMenuLinkProps extends Omit<HTMLProps<'a'>, 'value' | 'onSelect'>, NavigationMenuLinkBaseProps {}

export const NavigationMenuLink = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>((props, ref) => {
  const [linkProps, localProps] = createSplitProps<LinkProps>()(props, ['value', 'active', 'onSelect'])
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = mergeProps(navigationMenu.getLinkProps(linkProps), localProps)

  return <ui.a {...mergedProps} ref={ref} />
})

NavigationMenuLink.displayName = 'NavigationMenuLink'

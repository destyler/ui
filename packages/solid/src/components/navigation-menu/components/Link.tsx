import type { LinkProps } from '@destyler/navigation-menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { createMemo, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'
import { useNavigationMenuItemPropsContext } from '../hooks/use-navigation-menu-item-props-context'

export interface NavigationMenuLinkBaseProps
  extends Partial<LinkProps>,
  PolymorphicProps<'a'> {}
export interface NavigationMenuLinkProps
  extends Assign<HTMLProps<'a'>, NavigationMenuLinkBaseProps> {}

export function NavigationMenuLink(props: NavigationMenuLinkProps) {
  const [linkProps, localProps] = splitProps(props, ['active', 'onSelect', 'value'])
  const navigationMenu = useNavigationMenuContext()
  const itemProps = useNavigationMenuItemPropsContext()
  const resolvedProps = createMemo<LinkProps>(() => {
    const value = linkProps.value ?? itemProps?.().value
    if (value === undefined) {
      const error = new Error(
        'NavigationMenu.Link requires a value prop or a parent NavigationMenu.Item',
      )
      error.name = 'ContextError'
      throw error
    }
    return {
      active: linkProps.active,
      onSelect: linkProps.onSelect,
      value,
    }
  })
  const mergedProps = mergeProps(
    () => navigationMenu().getLinkProps(resolvedProps()),
    localProps,
  )

  return <ui.a {...mergedProps} />
}

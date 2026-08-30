import type { ContentProps } from '@destyler/navigation-menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { createMemo, Show, splitProps } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'
import { useNavigationMenuItemPropsContext } from '../hooks/use-navigation-menu-item-props-context'

export interface NavigationMenuContentBaseProps
  extends Partial<ContentProps>,
  PolymorphicProps<'div'> {}
export interface NavigationMenuContentProps
  extends Assign<HTMLProps<'div'>, NavigationMenuContentBaseProps> {}

export function NavigationMenuContent(props: NavigationMenuContentProps) {
  const [contentProps, localProps] = splitProps(props, ['value'])
  const navigationMenu = useNavigationMenuContext()
  const itemProps = useNavigationMenuItemPropsContext()
  const presence = usePresenceContext()
  const resolvedProps = createMemo<ContentProps>(() => {
    const value = contentProps.value ?? itemProps?.().value
    if (value === undefined) {
      const error = new Error(
        'NavigationMenu.Content requires a value prop or a parent NavigationMenu.Item',
      )
      error.name = 'ContextError'
      throw error
    }
    return { value }
  })
  const mergedProps = mergeProps(
    () => presence().presenceProps,
    () => navigationMenu().getContentProps(resolvedProps()),
    localProps,
  )

  return (
    <Show when={!presence().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}

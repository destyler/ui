import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuViewportBaseProps extends PolymorphicProps<'div'> {}
export interface NavigationMenuViewportProps
  extends HTMLProps<'div'>,
  NavigationMenuViewportBaseProps {}

export function NavigationMenuViewport(props: NavigationMenuViewportProps) {
  const navigationMenu = useNavigationMenuContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    () => navigationMenu().getViewportProps(),
    () => presence().presenceProps,
    props,
  )

  return (
    <Show when={!presence().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}

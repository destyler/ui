import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'
import { useNavigationMenuPresence } from '../hooks/use-navigation-menu-presence'

export interface NavigationMenuIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface NavigationMenuIndicatorProps
  extends HTMLProps<'div'>,
  NavigationMenuIndicatorBaseProps {}

export function NavigationMenuIndicator(props: NavigationMenuIndicatorProps) {
  const navigationMenu = useNavigationMenuContext()
  const presence = useNavigationMenuPresence(() => navigationMenu().value !== null)
  const mergedProps = mergeProps(
    () => navigationMenu().getIndicatorProps(),
    () => presence().presenceProps,
    props,
  )

  return (
    <Show when={!presence().unmounted}>
      <ui.div
        {...mergedProps}
        ref={composeRefs(presence().presenceProps.ref, props.ref)}
      />
    </Show>
  )
}

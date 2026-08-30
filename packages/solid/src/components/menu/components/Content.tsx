import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuContentBaseProps extends PolymorphicProps<'div'> {}
export interface MenuContentProps extends HTMLProps<'div'>, MenuContentBaseProps {}

export function MenuContent(props: MenuContentProps) {
  const context = useMenuContext()
  const presenceContext = usePresenceContext()
  const mergedProps = mergeProps(
    () => context().getContentProps(),
    () => presenceContext().presenceProps,
    props,
  )

  return (
    <Show when={!presenceContext().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}

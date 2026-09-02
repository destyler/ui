import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface MenuPositionerProps extends HTMLProps<'div'>, MenuPositionerBaseProps {}

export function MenuPositioner(props: MenuPositionerProps) {
  const context = useMenuContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(() => context().getPositionerProps(), props)

  return (
    <Show when={!presence().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}

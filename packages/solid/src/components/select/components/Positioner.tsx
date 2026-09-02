import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface SelectPositionerProps extends HTMLProps<'div'>, SelectPositionerBaseProps {}

export function SelectPositioner(props: SelectPositionerProps) {
  const select = useSelectContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(() => select().getPositionerProps(), props)

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}

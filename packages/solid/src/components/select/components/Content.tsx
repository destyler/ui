import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectContentBaseProps extends PolymorphicProps<'div'> {}
export interface SelectContentProps extends HTMLProps<'div'>, SelectContentBaseProps {}

export function SelectContent(props: SelectContentProps) {
  const select = useSelectContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(
    () => select().getContentProps(),
    () => presenceApi().presenceProps,
    props,
  )

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}

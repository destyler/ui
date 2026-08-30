import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogContentBaseProps extends PolymorphicProps<'div'> {}
export interface DialogContentProps extends HTMLProps<'div'>, DialogContentBaseProps {}

export function DialogContent(props: DialogContentProps) {
  const api = useDialogContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(
    () => api().getContentProps(),
    () => presenceApi().presenceProps,
    props,
  )

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}

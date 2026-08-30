import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DialogTriggerProps extends HTMLProps<'button'>, DialogTriggerBaseProps {}

export function DialogTrigger(props: DialogTriggerProps) {
  const api = useDialogContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(
    () => api().getTriggerProps(),
    () => ({ 'aria-controls': presenceApi().unmounted && null }),
    props,
  )

  return <ui.button {...mergedProps} />
}

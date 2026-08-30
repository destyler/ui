import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ClipboardTriggerProps extends HTMLProps<'button'>, ClipboardTriggerBaseProps {}

export function ClipboardTrigger(props: ClipboardTriggerProps) {
  const api = useClipboardContext()
  const mergedProps = mergeProps(() => api().getTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

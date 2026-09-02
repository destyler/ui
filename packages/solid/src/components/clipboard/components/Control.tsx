import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardControlBaseProps extends PolymorphicProps<'div'> {}
export interface ClipboardControlProps extends HTMLProps<'div'>, ClipboardControlBaseProps {}

export function ClipboardControl(props: ClipboardControlProps) {
  const api = useClipboardContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.div {...mergedProps} />
}

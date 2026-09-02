import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardLabelBaseProps extends PolymorphicProps<'label'> {}
export interface ClipboardLabelProps extends HTMLProps<'label'>, ClipboardLabelBaseProps {}

export function ClipboardLabel(props: ClipboardLabelProps) {
  const api = useClipboardContext()
  const mergedProps = mergeProps(() => api().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}

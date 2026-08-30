import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardInputBaseProps extends PolymorphicProps<'input'> {}
export interface ClipboardInputProps extends HTMLProps<'input'>, ClipboardInputBaseProps {}

export function ClipboardInput(props: ClipboardInputProps) {
  const api = useClipboardContext()
  const mergedProps = mergeProps(() => api().getInputProps(), props)

  return <ui.input {...mergedProps} />
}

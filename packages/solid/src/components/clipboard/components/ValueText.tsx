import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { orFallback } from '~/utils/or-fallback'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface ClipboardValueTextProps extends HTMLProps<'span'>, ClipboardValueTextBaseProps {}

export function ClipboardValueText(props: ClipboardValueTextProps) {
  const api = useClipboardContext()
  const mergedProps = mergeProps(props)

  return <ui.span {...mergedProps}>{orFallback(props.children, api().value)}</ui.span>
}

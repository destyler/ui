import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface ProgressValueTextProps extends HTMLProps<'span'>, ProgressValueTextBaseProps {}

export function ProgressValueText(props: ProgressValueTextProps) {
  const api = useProgressContext()
  const mergedProps = mergeProps(() => api().getValueTextProps(), props)

  return <ui.span {...mergedProps}>{props.children || api().percentAsString}</ui.span>
}

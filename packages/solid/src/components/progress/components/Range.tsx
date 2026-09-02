import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressRangeBaseProps extends PolymorphicProps<'div'> {}
export interface ProgressRangeProps extends HTMLProps<'div'>, ProgressRangeBaseProps {}

export function ProgressRange(props: ProgressRangeProps) {
  const api = useProgressContext()
  const mergedProps = mergeProps(() => api().getRangeProps(), props)

  return <ui.div {...mergedProps} />
}

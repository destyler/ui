import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressCircleRangeBaseProps extends PolymorphicProps<'circle'> {}
export interface ProgressCircleRangeProps
  extends HTMLProps<'circle'>,
  ProgressCircleRangeBaseProps {}

export function ProgressCircleRange(props: ProgressCircleRangeProps) {
  const api = useProgressContext()
  const mergedProps = mergeProps(() => api().getCircleRangeProps(), props)

  return <ui.circle {...mergedProps} />
}

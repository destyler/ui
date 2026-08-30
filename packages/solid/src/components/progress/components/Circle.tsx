import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressCircleBaseProps extends PolymorphicProps<'svg'> {}
export interface ProgressCircleProps extends HTMLProps<'svg'>, ProgressCircleBaseProps {}

export function ProgressCircle(props: ProgressCircleProps) {
  const api = useProgressContext()
  const mergedProps = mergeProps(() => api().getCircleProps(), props)

  return <ui.svg {...mergedProps} />
}

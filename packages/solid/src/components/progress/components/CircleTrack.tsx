import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressCircleTrackBaseProps extends PolymorphicProps<'circle'> {}
export interface ProgressCircleTrackProps
  extends HTMLProps<'circle'>,
  ProgressCircleTrackBaseProps {}

export function ProgressCircleTrack(props: ProgressCircleTrackProps) {
  const api = useProgressContext()
  const mergedProps = mergeProps(() => api().getCircleTrackProps(), props)

  return <ui.circle {...mergedProps} />
}

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressTrackBaseProps extends PolymorphicProps<'div'> {}
export interface ProgressTrackProps extends HTMLProps<'div'>, ProgressTrackBaseProps {}

export function ProgressTrack(props: ProgressTrackProps) {
  const api = useProgressContext()
  const mergedProps = mergeProps(() => api().getTrackProps(), props)

  return <ui.div {...mergedProps} />
}

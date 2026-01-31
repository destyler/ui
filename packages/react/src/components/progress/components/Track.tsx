import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressTrackBaseProps extends PolymorphicProps {}
export interface ProgressTrackProps extends HTMLProps<'div'>, ProgressTrackBaseProps {}

export const ProgressTrack = forwardRef<HTMLDivElement, ProgressTrackProps>((props, ref) => {
  const progress = useProgressContext()
  const mergedProps = mergeProps(progress.getTrackProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ProgressTrack.displayName = 'ProgressTrack'

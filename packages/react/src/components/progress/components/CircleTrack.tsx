import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressCircleTrackBaseProps extends PolymorphicProps {}
export interface ProgressCircleTrackProps extends HTMLProps<'circle'>, ProgressCircleTrackBaseProps {}

export const ProgressCircleTrack = forwardRef<SVGCircleElement, ProgressCircleTrackProps>((props, ref) => {
  const progress = useProgressContext()
  const mergedProps = mergeProps(progress.getCircleTrackProps(), props)

  return <ui.circle ref={ref} {...mergedProps} />
})

ProgressCircleTrack.displayName = 'ProgressCircleTrack'

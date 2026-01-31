import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressCircleRangeBaseProps extends PolymorphicProps {}
export interface ProgressCircleRangeProps extends HTMLProps<'circle'>, ProgressCircleRangeBaseProps {}

export const ProgressCircleRange = forwardRef<SVGCircleElement, ProgressCircleRangeProps>((props, ref) => {
  const progress = useProgressContext()
  const mergedProps = mergeProps(progress.getCircleRangeProps(), props)

  return <ui.circle ref={ref} {...mergedProps} />
})

ProgressCircleRange.displayName = 'ProgressCircleRange'

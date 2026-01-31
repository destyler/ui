import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressCircleBaseProps extends PolymorphicProps {}
export interface ProgressCircleProps extends HTMLProps<'svg'>, ProgressCircleBaseProps {}

export const ProgressCircle = forwardRef<SVGSVGElement, ProgressCircleProps>((props, ref) => {
  const progress = useProgressContext()
  const mergedProps = mergeProps(progress.getCircleProps(), props)

  return <ui.svg ref={ref} {...mergedProps} />
})

ProgressCircle.displayName = 'ProgressCircle'

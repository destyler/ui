import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsProgressBaseProps extends PolymorphicProps {}
export interface StepsProgressProps extends HTMLProps<'div'>, StepsProgressBaseProps {}

export const StepsProgress = forwardRef<HTMLDivElement, StepsProgressProps>((props, ref) => {
  const steps = useStepsContext()
  const mergedProps = mergeProps(steps.getProgressProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

StepsProgress.displayName = 'StepsProgress'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsPrevTriggerBaseProps extends PolymorphicProps {}
export interface StepsPrevTriggerProps extends HTMLProps<'button'>, StepsPrevTriggerBaseProps {}

export const StepsPrevTrigger = forwardRef<HTMLButtonElement, StepsPrevTriggerProps>((props, ref) => {
  const steps = useStepsContext()
  const mergedProps = mergeProps(steps.getPrevTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

StepsPrevTrigger.displayName = 'StepsPrevTrigger'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsNextTriggerBaseProps extends PolymorphicProps {}
export interface StepsNextTriggerProps extends HTMLProps<'button'>, StepsNextTriggerBaseProps {}

export const StepsNextTrigger = forwardRef<HTMLButtonElement, StepsNextTriggerProps>((props, ref) => {
  const steps = useStepsContext()
  const mergedProps = mergeProps(steps.getNextTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

StepsNextTrigger.displayName = 'StepsNextTrigger'

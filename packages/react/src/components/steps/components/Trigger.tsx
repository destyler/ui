import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'
import { useStepsItemPropsContext } from '../hooks/use-steps-item-props-context'

export interface StepsTriggerBaseProps extends PolymorphicProps {}
export interface StepsTriggerProps extends HTMLProps<'button'>, StepsTriggerBaseProps {}

export const StepsTrigger = forwardRef<HTMLButtonElement, StepsTriggerProps>((props, ref) => {
  const steps = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const mergedProps = mergeProps(steps.getTriggerProps(itemProps), props)

  return <ui.button {...mergedProps} ref={ref} />
})

StepsTrigger.displayName = 'StepsTrigger'

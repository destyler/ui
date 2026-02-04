import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'
import { useStepsItemPropsContext } from '../hooks/use-steps-item-props-context'

export interface StepsSeparatorBaseProps extends PolymorphicProps {}
export interface StepsSeparatorProps extends HTMLProps<'div'>, StepsSeparatorBaseProps {}

export const StepsSeparator = forwardRef<HTMLDivElement, StepsSeparatorProps>((props, ref) => {
  const steps = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const mergedProps = mergeProps(steps.getSeparatorProps(itemProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

StepsSeparator.displayName = 'StepsSeparator'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'
import { useStepsItemPropsContext } from '../hooks/use-steps-item-props-context'

export interface StepsIndicatorBaseProps extends PolymorphicProps {}
export interface StepsIndicatorProps extends HTMLProps<'div'>, StepsIndicatorBaseProps {}

export const StepsIndicator = forwardRef<HTMLDivElement, StepsIndicatorProps>((props, ref) => {
  const steps = useStepsContext()
  const itemProps = useStepsItemPropsContext()
  const mergedProps = mergeProps(steps.getIndicatorProps(itemProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

StepsIndicator.displayName = 'StepsIndicator'

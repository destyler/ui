import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsListBaseProps extends PolymorphicProps {}
export interface StepsListProps extends HTMLProps<'div'>, StepsListBaseProps {}

export const StepsList = forwardRef<HTMLDivElement, StepsListProps>((props, ref) => {
  const steps = useStepsContext()
  const mergedProps = mergeProps(steps.getListProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

StepsList.displayName = 'StepsList'

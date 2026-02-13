import type { StepActionTriggerProps } from '@destyler/tour'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourActionTriggerBaseProps extends PolymorphicProps, StepActionTriggerProps {}
export interface TourActionTriggerProps extends HTMLProps<'button'>, TourActionTriggerBaseProps {}

export const TourActionTrigger = forwardRef<HTMLButtonElement, TourActionTriggerProps>((props, ref) => {
  const [actionTriggerProps, localProps] = createSplitProps<StepActionTriggerProps>()(props, ['action'])
  const tour = useTourContext()
  const mergedProps = mergeProps(tour.getActionTriggerProps(actionTriggerProps), localProps)

  return (
    <ui.button {...mergedProps} ref={ref}>
      {mergedProps.children || actionTriggerProps.action.label}
    </ui.button>
  )
})

TourActionTrigger.displayName = 'TourActionTrigger'

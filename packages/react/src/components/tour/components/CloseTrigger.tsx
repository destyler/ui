import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourCloseTriggerBaseProps extends PolymorphicProps {}
export interface TourCloseTriggerProps extends HTMLProps<'button'>, TourCloseTriggerBaseProps {}

export const TourCloseTrigger = forwardRef<HTMLButtonElement, TourCloseTriggerProps>((props, ref) => {
  const tour = useTourContext()
  const mergedProps = mergeProps(tour.getCloseTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

TourCloseTrigger.displayName = 'TourCloseTrigger'

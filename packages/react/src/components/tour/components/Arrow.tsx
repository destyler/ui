import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourArrowBaseProps extends PolymorphicProps {}
export interface TourArrowProps extends HTMLProps<'div'>, TourArrowBaseProps {}

export const TourArrow = forwardRef<HTMLDivElement, TourArrowProps>((props, ref) => {
  const tour = useTourContext()
  const mergedProps = mergeProps(tour.getArrowProps(), props)

  return tour.step?.arrow ? <ui.div {...mergedProps} ref={ref} /> : null
})

TourArrow.displayName = 'TourArrow'

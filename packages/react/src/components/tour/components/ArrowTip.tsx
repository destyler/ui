import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourArrowTipBaseProps extends PolymorphicProps {}
export interface TourArrowTipProps extends HTMLProps<'div'>, TourArrowTipBaseProps {}

export const TourArrowTip = forwardRef<HTMLDivElement, TourArrowTipProps>((props, ref) => {
  const tour = useTourContext()
  const mergedProps = mergeProps(tour.getArrowTipProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TourArrowTip.displayName = 'TourArrowTip'

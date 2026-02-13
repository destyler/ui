import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourProgressTextBaseProps extends PolymorphicProps {}
export interface TourProgressTextProps extends HTMLProps<'div'>, TourProgressTextBaseProps {}

export const TourProgressText = forwardRef<HTMLDivElement, TourProgressTextProps>((props, ref) => {
  const tour = useTourContext()
  const mergedProps = mergeProps(tour.getProgressTextProps(), props)

  return (
    <ui.div {...mergedProps} ref={ref}>
      {mergedProps.children || tour.getProgressText()}
    </ui.div>
  )
})

TourProgressText.displayName = 'TourProgressText'

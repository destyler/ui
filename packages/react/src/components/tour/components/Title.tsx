import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourTitleBaseProps extends PolymorphicProps {}
export interface TourTitleProps extends HTMLProps<'h2'>, TourTitleBaseProps {}

export const TourTitle = forwardRef<HTMLHeadingElement, TourTitleProps>((props, ref) => {
  const tour = useTourContext()
  const mergedProps = mergeProps(tour.getTitleProps(), props)

  return (
    <ui.h2 {...mergedProps} ref={ref}>
      {mergedProps.children || tour.step?.title}
    </ui.h2>
  )
})

TourTitle.displayName = 'TourTitle'

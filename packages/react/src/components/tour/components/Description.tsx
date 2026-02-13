import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourDescriptionBaseProps extends PolymorphicProps {}
export interface TourDescriptionProps extends HTMLProps<'div'>, TourDescriptionBaseProps {}

export const TourDescription = forwardRef<HTMLDivElement, TourDescriptionProps>((props, ref) => {
  const tour = useTourContext()
  const mergedProps = mergeProps(tour.getDescriptionProps(), props)

  return (
    <ui.div {...mergedProps} ref={ref}>
      {mergedProps.children || tour.step?.description}
    </ui.div>
  )
})

TourDescription.displayName = 'TourDescription'

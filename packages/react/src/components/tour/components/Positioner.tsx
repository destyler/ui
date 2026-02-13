import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourPositionerBaseProps extends PolymorphicProps {}
export interface TourPositionerProps extends HTMLProps<'div'>, TourPositionerBaseProps {}

export const TourPositioner = forwardRef<HTMLDivElement, TourPositionerProps>((props, ref) => {
  const tour = useTourContext()
  const mergedProps = mergeProps(tour.getPositionerProps(), props)
  const presence = usePresenceContext()

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

TourPositioner.displayName = 'TourPositioner'

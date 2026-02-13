import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourContentBaseProps extends PolymorphicProps {}
export interface TourContentProps extends HTMLProps<'div'>, TourContentBaseProps {}

export const TourContent = forwardRef<HTMLDivElement, TourContentProps>((props, ref) => {
  const tour = useTourContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(tour.getContentProps(), presence.getPresenceProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composeRefs(presence.ref, ref)} />
})

TourContent.displayName = 'TourContent'

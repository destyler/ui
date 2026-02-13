import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useRenderStrategyPropsContext } from '~/utils/render-strategy'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourBackdropBaseProps extends PolymorphicProps {}
export interface TourBackdropProps extends HTMLProps<'div'>, TourBackdropBaseProps {}

export const TourBackdrop = forwardRef<HTMLDivElement, TourBackdropProps>((props, ref) => {
  const tour = useTourContext()
  const renderStrategyProps = useRenderStrategyPropsContext()
  const presence = usePresence({
    ...renderStrategyProps,
    present: tour.open,
  })
  const mergedProps = mergeProps(tour.getBackdropProps(), presence.getPresenceProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composeRefs(presence.ref, ref)} hidden={!tour.step?.backdrop} />
})

TourBackdrop.displayName = 'TourBackdrop'

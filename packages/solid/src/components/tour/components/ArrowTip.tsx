import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface TourArrowTipProps extends HTMLProps<'div'>, TourArrowTipBaseProps {}

export function TourArrowTip(props: TourArrowTipProps) {
  const tour = useTourContext()
  const mergedProps = mergeProps(() => tour().getArrowTipProps(), props)

  return <ui.div {...mergedProps} />
}

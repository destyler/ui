import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface TourCloseTriggerProps extends HTMLProps<'button'>, TourCloseTriggerBaseProps {}

export function TourCloseTrigger(props: TourCloseTriggerProps) {
  const tour = useTourContext()
  const mergedProps = mergeProps(() => tour().getCloseTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

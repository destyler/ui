import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourProgressTextBaseProps extends PolymorphicProps<'div'> {}
export interface TourProgressTextProps extends HTMLProps<'div'>, TourProgressTextBaseProps {}

export function TourProgressText(props: TourProgressTextProps) {
  const tour = useTourContext()
  const mergedProps = mergeProps(() => tour().getProgressTextProps(), props)

  return <ui.div {...mergedProps}>{mergedProps.children || tour().getProgressText()}</ui.div>
}

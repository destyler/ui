import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { orFallback } from '~/utils/or-fallback'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourDescriptionBaseProps extends PolymorphicProps<'div'> {}
export interface TourDescriptionProps extends HTMLProps<'div'>, TourDescriptionBaseProps {}

export function TourDescription(props: TourDescriptionProps) {
  const tour = useTourContext()
  const mergedProps = mergeProps(() => tour().getDescriptionProps(), props)

  return <ui.div {...mergedProps}>{orFallback(mergedProps.children, tour().step?.description)}</ui.div>
}

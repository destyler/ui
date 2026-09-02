import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { orFallback } from '~/utils/or-fallback'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourTitleBaseProps extends PolymorphicProps<'h2'> {}
export interface TourTitleProps extends HTMLProps<'h2'>, TourTitleBaseProps {}

export function TourTitle(props: TourTitleProps) {
  const tour = useTourContext()
  const mergedProps = mergeProps(() => tour().getTitleProps(), props)

  return <ui.h2 {...mergedProps}>{orFallback(mergedProps.children, tour().step?.title)}</ui.h2>
}

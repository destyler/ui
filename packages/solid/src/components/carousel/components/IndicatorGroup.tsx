import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselIndicatorGroupBaseProps extends PolymorphicProps<'div'> {}
export interface CarouselIndicatorGroupProps
  extends HTMLProps<'div'>,
  CarouselIndicatorGroupBaseProps {}

export function CarouselIndicatorGroup(props: CarouselIndicatorGroupProps) {
  const api = useCarouselContext()
  const mergedProps = mergeProps(() => api().getIndicatorGroupProps(), props)

  return <ui.div {...mergedProps} />
}

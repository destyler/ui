import type { IndicatorProps } from '@destyler/carousel'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselIndicatorBaseProps extends IndicatorProps, PolymorphicProps<'button'> {}
export interface CarouselIndicatorProps extends HTMLProps<'button'>, CarouselIndicatorBaseProps {}

export function CarouselIndicator(props: CarouselIndicatorProps) {
  const [indicatorProps, localProps] = createSplitProps<IndicatorProps>()(props, [
    'index',
    'readOnly',
  ])
  const api = useCarouselContext()
  const mergedProps = mergeProps(() => api().getIndicatorProps(indicatorProps), localProps)

  return <ui.button {...mergedProps} />
}

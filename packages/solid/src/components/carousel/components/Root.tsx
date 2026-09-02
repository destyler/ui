import type { UseCarouselProps } from '../hooks/use-carousel'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCarousel } from '../hooks/use-carousel'
import { CarouselProvider } from '../hooks/use-carousel-context'

export interface CarouselRootBaseProps extends UseCarouselProps, PolymorphicProps<'div'> {}
export interface CarouselRootProps extends HTMLProps<'div'>, CarouselRootBaseProps {}

export function CarouselRoot(props: CarouselRootProps) {
  const [useCarouselProps, localProps] = createSplitProps<UseCarouselProps>()(props, [
    'allowMouseDrag',
    'autoplay',
    'defaultPage',
    'id',
    'ids',
    'inViewThreshold',
    'loop',
    'onAutoplayStatusChange',
    'onDragStatusChange',
    'onPageChange',
    'orientation',
    'padding',
    'page',
    'slideCount',
    'slidesPerMove',
    'slidesPerPage',
    'snapType',
    'spacing',
    'translations',
  ])
  const api = useCarousel(useCarouselProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <CarouselProvider value={api}>
      <ui.div {...mergedProps} />
    </CarouselProvider>
  )
}

import type { IndicatorProps } from '@destyler/carousel'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselIndicatorBaseProps extends IndicatorProps, PolymorphicProps {}
export interface CarouselIndicatorProps extends HTMLProps<'button'>, CarouselIndicatorBaseProps {}

export const CarouselIndicator = forwardRef<HTMLButtonElement, CarouselIndicatorProps>((props, ref) => {
  const [indicatorProps, localProps] = createSplitProps<IndicatorProps>()(props, ['readOnly', 'index'])

  const carousel = useCarouselContext()
  const mergedProps = mergeProps(carousel.getIndicatorProps(indicatorProps), localProps)

  return <ui.button {...mergedProps} ref={ref} />
})

CarouselIndicator.displayName = 'CarouselIndicator'

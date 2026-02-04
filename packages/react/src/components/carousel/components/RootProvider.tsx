import type { UseCarouselReturn } from '../hooks/use-carousel'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { CarouselProvider } from '../hooks/use-carousel-context'

interface RootProviderProps {
  value: UseCarouselReturn
}

export interface CarouselRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface CarouselRootProviderProps extends HTMLProps<'div'>, CarouselRootProviderBaseProps {}

export const CarouselRootProvider = forwardRef<HTMLDivElement, CarouselRootProviderProps>((props, ref) => {
  const [{ value: carousel }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(carousel.getRootProps(), localProps)

  return (
    <CarouselProvider value={carousel}>
      <ui.div {...mergedProps} ref={ref} />
    </CarouselProvider>
  )
})

CarouselRootProvider.displayName = 'CarouselRootProvider'

import type { UseCarouselReturn } from '../hooks/use-carousel'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { CarouselProvider } from '../hooks/use-carousel-context'

interface RootProviderProps {
  value: UseCarouselReturn
}

export interface CarouselRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface CarouselRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  CarouselRootProviderBaseProps {}

export function CarouselRootProvider(props: CarouselRootProviderProps) {
  const [{ value: carousel }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => carousel().getRootProps(), localProps)

  return (
    <CarouselProvider value={carousel}>
      <ui.div {...mergedProps} />
    </CarouselProvider>
  )
}

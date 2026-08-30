import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselItemGroupBaseProps extends PolymorphicProps<'div'> {}
export interface CarouselItemGroupProps extends HTMLProps<'div'>, CarouselItemGroupBaseProps {}

export function CarouselItemGroup(props: CarouselItemGroupProps) {
  const api = useCarouselContext()
  const mergedProps = mergeProps(() => api().getItemGroupProps(), props)
  return <ui.div {...mergedProps} />
}

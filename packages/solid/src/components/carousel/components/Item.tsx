import type { ItemProps } from '@destyler/carousel'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface CarouselItemProps extends HTMLProps<'div'>, CarouselItemBaseProps {}

export function CarouselItem(props: CarouselItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['index', 'snapAlign'])
  const api = useCarouselContext()
  const mergedProps = mergeProps(() => api().getItemProps(itemProps), localProps)

  return <ui.div {...mergedProps} />
}

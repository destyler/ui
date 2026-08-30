import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselNextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CarouselNextTriggerProps
  extends HTMLProps<'button'>,
  CarouselNextTriggerBaseProps {}

export function CarouselNextTrigger(props: CarouselNextTriggerProps) {
  const api = useCarouselContext()
  const mergedProps = mergeProps(() => api().getNextTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

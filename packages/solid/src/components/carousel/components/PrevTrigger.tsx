import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CarouselPrevTriggerProps
  extends HTMLProps<'button'>,
  CarouselPrevTriggerBaseProps {}

export function CarouselPrevTrigger(props: CarouselPrevTriggerProps) {
  const api = useCarouselContext()
  const mergedProps = mergeProps(() => api().getPrevTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselAutoplayTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CarouselAutoplayTriggerProps
  extends HTMLProps<'button'>,
  CarouselAutoplayTriggerBaseProps {}

export function CarouselAutoplayTrigger(props: CarouselAutoplayTriggerProps) {
  const api = useCarouselContext()
  const mergedProps = mergeProps(() => api().getAutoplayTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

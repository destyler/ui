import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselControlBaseProps extends PolymorphicProps<'div'> {}
export interface CarouselControlProps extends HTMLProps<'div'>, CarouselControlBaseProps {}

export function CarouselControl(props: CarouselControlProps) {
  const api = useCarouselContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.div {...mergedProps} />
}

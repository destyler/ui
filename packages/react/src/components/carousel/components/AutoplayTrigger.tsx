import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCarouselContext } from '../hooks/use-carousel-context'

export interface CarouselAutoplayTriggerBaseProps extends PolymorphicProps {}
export interface CarouselAutoplayTriggerProps extends HTMLProps<'button'>, CarouselAutoplayTriggerBaseProps {}

export const CarouselAutoplayTrigger = forwardRef<HTMLButtonElement, CarouselAutoplayTriggerProps>((props, ref) => {
  const carousel = useCarouselContext()
  const mergedProps = mergeProps(carousel.getAutoplayTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

CarouselAutoplayTrigger.displayName = 'CarouselAutoplayTrigger'

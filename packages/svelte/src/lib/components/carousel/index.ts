export { carouselAnatomy } from './anatomy'
export {
  default as CarouselAutoplayTrigger,
  type CarouselAutoplayTriggerBaseProps,
  type CarouselAutoplayTriggerProps,
} from './components/AutoplayTrigger.svelte'
export { default as CarouselContext, type CarouselContextProps } from './components/Context.svelte'
export {
  default as CarouselControl,
  type CarouselControlBaseProps,
  type CarouselControlProps,
} from './components/Control.svelte'
export {
  default as CarouselIndicator,
  type CarouselIndicatorBaseProps,
  type CarouselIndicatorProps,
} from './components/Indicator.svelte'
export {
  default as CarouselIndicatorGroup,
  type CarouselIndicatorGroupBaseProps,
  type CarouselIndicatorGroupProps,
} from './components/IndicatorGroup.svelte'
export { default as CarouselItem, type CarouselItemBaseProps, type CarouselItemProps } from './components/Item.svelte'
export {
  default as CarouselItemGroup,
  type CarouselItemGroupBaseProps,
  type CarouselItemGroupProps,
} from './components/ItemGroup.svelte'
export {
  default as CarouselNextTrigger,
  type CarouselNextTriggerBaseProps,
  type CarouselNextTriggerProps,
} from './components/NextTrigger.svelte'
export {
  default as CarouselPrevTrigger,
  type CarouselPrevTriggerBaseProps,
  type CarouselPrevTriggerProps,
} from './components/PrevTrigger.svelte'
export { default as CarouselRoot, type CarouselRootBaseProps, type CarouselRootProps } from './components/Root.svelte'
export {
  default as CarouselRootProvider,
  type CarouselRootProviderBaseProps,
  type CarouselRootProviderProps,
} from './components/RootProvider.svelte'
export { useCarouselContext, type UseCarouselContext } from './hooks/use-carousel-context'
export { useCarousel, type UseCarouselProps, type UseCarouselReturn } from './hooks/use-carousel.svelte'
export * as Carousel from './namespace'

export type {
  AutoplayStatusDetails as CarouselAutoplayStatusDetails,
  DragStatusDetails as CarouselDragStatusDetails,
  PageChangeDetails as CarouselPageChangeDetails,
} from '@destyler/carousel'

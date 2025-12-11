export { carouselAnatomy } from './anatomy'

export {
  default as CarouselAutoplayTrigger,
  type CarouselAutoplayTriggerProps,
} from './components/AutoplayTrigger.vue'
export {
  default as CarouselContext,
  type CarouselContextProps,
} from './components/Context.vue'
export {
  default as CarouselControl,
  type CarouselControlProps,
} from './components/Control.vue'
export {
  default as CarouselIndicator,
  type CarouselIndicatorProps,
} from './components/Indicator.vue'
export {
  default as CarouselIndicatorGroup,
  type CarouselIndicatorGroupProps,
} from './components/IndicatorGroup.vue'
export {
  default as CarouselItem,
  type CarouselItemProps,
} from './components/Item.vue'
export {
  default as CarouselItemGroup,
  type CarouselItemGroupProps,
} from './components/ItemGroup.vue'
export {
  default as CarouselNextTrigger,
  type CarouselNextTriggerProps,
} from './components/NextTrigger.vue'
export {
  default as CarouselPrevTrigger,
  type CarouselPrevTriggerProps,
} from './components/PrevTrigger.vue'
export {
  default as CarouselRoot,
  type CarouselRootEmits,
  type CarouselRootProps,
} from './components/Root.vue'
export {
  default as CarouselRootProvider,
  type CarouselRootProviderProps,
} from './components/RootProvider.vue'

export { useCarousel, type UseCarouselProps, type UseCarouselReturn } from './composables/use-carousel'
export { useCarouselContext, type UseCarouselContext } from './composables/use-carousel-context'

export type {
  AutoplayStatusDetails as CarouselAutoplayStatusDetails,
  DragStatusDetails as CarouselDragStatusDetails,
  PageChangeDetails as CarouselPageChangeDetails,
} from '@destyler/carousel'

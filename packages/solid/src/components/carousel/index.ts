export { carouselAnatomy } from './anatomy'
export {
  CarouselAutoplayTrigger,
  type CarouselAutoplayTriggerBaseProps,
  type CarouselAutoplayTriggerProps,
} from './components/AutoplayTrigger'
export { CarouselContext, type CarouselContextProps } from './components/Context'
export {
  CarouselControl,
  type CarouselControlBaseProps,
  type CarouselControlProps,
} from './components/Control'
export {
  CarouselIndicator,
  type CarouselIndicatorBaseProps,
  type CarouselIndicatorProps,
} from './components/Indicator'
export {
  CarouselIndicatorGroup,
  type CarouselIndicatorGroupBaseProps,
  type CarouselIndicatorGroupProps,
} from './components/IndicatorGroup'
export { CarouselItem, type CarouselItemBaseProps, type CarouselItemProps } from './components/Item'
export {
  CarouselItemGroup,
  type CarouselItemGroupBaseProps,
  type CarouselItemGroupProps,
} from './components/ItemGroup'
export {
  CarouselNextTrigger,
  type CarouselNextTriggerBaseProps,
  type CarouselNextTriggerProps,
} from './components/NextTrigger'
export {
  CarouselPrevTrigger,
  type CarouselPrevTriggerBaseProps,
  type CarouselPrevTriggerProps,
} from './components/PrevTrigger'
export { CarouselRoot, type CarouselRootBaseProps, type CarouselRootProps } from './components/Root'
export {
  CarouselRootProvider,
  type CarouselRootProviderBaseProps,
  type CarouselRootProviderProps,
} from './components/RootProvider'
export { useCarousel, type UseCarouselProps, type UseCarouselReturn } from './hooks/use-carousel'
export { useCarouselContext, type UseCarouselContext } from './hooks/use-carousel-context'
export * as Carousel from './namespace'

export type {
  AutoplayStatusDetails as CarouselAutoplayStatusDetails,
  DragStatusDetails as CarouselDragStatusDetails,
  PageChangeDetails as CarouselPageChangeDetails,
} from '@destyler/carousel'

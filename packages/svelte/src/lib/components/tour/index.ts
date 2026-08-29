export { tourAnatomy } from './anatomy'
export { default as TourActions, type TourActionsProps } from './components/Actions.svelte'
export {
  default as TourActionTrigger,
  type TourActionTriggerBaseProps,
  type TourActionTriggerProps,
} from './components/ActionTrigger.svelte'
export { default as TourArrow, type TourArrowBaseProps, type TourArrowProps } from './components/Arrow.svelte'
export { default as TourArrowTip, type TourArrowTipBaseProps, type TourArrowTipProps } from './components/ArrowTip.svelte'
export { default as TourBackdrop, type TourBackdropBaseProps, type TourBackdropProps } from './components/Backdrop.svelte'
export {
  default as TourCloseTrigger,
  type TourCloseTriggerBaseProps,
  type TourCloseTriggerProps,
} from './components/CloseTrigger.svelte'
export { default as TourContent, type TourContentBaseProps, type TourContentProps } from './components/Content.svelte'
export { default as TourContext, type TourContextProps } from './components/Context.svelte'
export { default as TourControl, type TourControlBaseProps, type TourControlProps } from './components/Control.svelte'
export {
  default as TourDescription,
  type TourDescriptionBaseProps,
  type TourDescriptionProps,
} from './components/Description.svelte'
export {
  default as TourPositioner,
  type TourPositionerBaseProps,
  type TourPositionerProps,
} from './components/Positioner.svelte'
export {
  default as TourProgressText,
  type TourProgressTextBaseProps,
  type TourProgressTextProps,
} from './components/ProgressText.svelte'
export { default as TourRoot, type TourRootBaseProps, type TourRootProps } from './components/Root.svelte'
export { default as TourSpotlight, type TourSpotlightBaseProps, type TourSpotlightProps } from './components/Spotlight.svelte'
export { default as TourTitle, type TourTitleBaseProps, type TourTitleProps } from './components/Title.svelte'
export { useTourContext, type UseTourContext } from './hooks/use-tour-context'
export { useTour, type UseTourProps, type UseTourReturn } from './hooks/use-tour.svelte'
export * as Tour from './namespace'

export type { StepDetails as TourStepDetails } from '@destyler/tour'

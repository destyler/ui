export { tooltipAnatomy } from './anatomy'
export { default as TooltipArrow, type TooltipArrowBaseProps, type TooltipArrowProps } from './components/Arrow.svelte'
export {
  default as TooltipArrowTip,
  type TooltipArrowTipBaseProps,
  type TooltipArrowTipProps,
} from './components/ArrowTip.svelte'
export {
  default as TooltipContent,
  type TooltipContentBaseProps,
  type TooltipContentProps,
} from './components/Content.svelte'
export { default as TooltipContext, type TooltipContextProps } from './components/Context.svelte'
export {
  default as TooltipPositioner,
  type TooltipPositionerBaseProps,
  type TooltipPositionerProps,
} from './components/Positioner.svelte'
export { default as TooltipRoot, type TooltipRootBaseProps, type TooltipRootProps } from './components/Root.svelte'
export {
  default as TooltipRootProvider,
  type TooltipRootProviderBaseProps,
  type TooltipRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as TooltipTrigger,
  type TooltipTriggerBaseProps,
  type TooltipTriggerProps,
} from './components/Trigger.svelte'
export { useTooltipContext, type UseTooltipContext } from './hooks/use-tooltip-context'
export { useTooltip, type UseTooltipProps, type UseTooltipReturn } from './hooks/use-tooltip.svelte'
export * as Tooltip from './namespace'

export type { OpenChangeDetails as TooltipOpenChangeDetails } from '@destyler/tooltip'

export { tooltipAnatomy } from './anatomy'
export { TooltipArrow, type TooltipArrowBaseProps, type TooltipArrowProps } from './components/Arrow'
export {
  TooltipArrowTip,
  type TooltipArrowTipBaseProps,
  type TooltipArrowTipProps,
} from './components/ArrowTip'
export {
  TooltipContent,
  type TooltipContentBaseProps,
  type TooltipContentProps,
} from './components/Content'
export { TooltipContext, type TooltipContextProps } from './components/Context'
export {
  TooltipPositioner,
  type TooltipPositionerBaseProps,
  type TooltipPositionerProps,
} from './components/Positioner'
export { TooltipRoot, type TooltipRootBaseProps, type TooltipRootProps } from './components/Root'
export {
  TooltipRootProvider,
  type TooltipRootProviderBaseProps,
  type TooltipRootProviderProps,
} from './components/RootProvider'
export {
  TooltipTrigger,
  type TooltipTriggerBaseProps,
  type TooltipTriggerProps,
} from './components/Trigger'
export { useTooltip, type UseTooltipProps, type UseTooltipReturn } from './hooks/use-tooltip'
export { useTooltipContext, type UseTooltipContext } from './hooks/use-tooltip-context'
export * as Tooltip from './namespace'

export type { OpenChangeDetails as TooltipOpenChangeDetails } from '@destyler/tooltip'

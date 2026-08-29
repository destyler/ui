export { timerAnatomy } from './anatomy'
export {
  default as TimerActionTrigger,
  type TimerActionTriggerBaseProps,
  type TimerActionTriggerProps,
} from './components/ActionTrigger.svelte'
export { default as TimerArea, type TimerAreaBaseProps, type TimerAreaProps } from './components/Area.svelte'
export { default as TimerContext, type TimerContextProps } from './components/Context.svelte'
export { default as TimerControl, type TimerControlBaseProps, type TimerControlProps } from './components/Control.svelte'
export { default as TimerItem, type TimerItemBaseProps, type TimerItemProps } from './components/Item.svelte'
export { default as TimerRoot, type TimerRootBaseProps, type TimerRootProps } from './components/Root.svelte'
export {
  default as TimerRootProvider,
  type TimerRootProviderBaseProps,
  type TimerRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as TimerSeparator,
  type TimerSeparatorBaseProps,
  type TimerSeparatorProps,
} from './components/Separator.svelte'
export { useTimerContext, type UseTimerContext } from './hooks/use-timer-context'
export { useTimer, type UseTimerProps, type UseTimerReturn } from './hooks/use-timer.svelte'
export * as Timer from './namespace'

export type { TickDetails as TimerTickDetails } from '@destyler/timer'

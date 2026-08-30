export { timerAnatomy } from './anatomy'
export {
  TimerActionTrigger,
  type TimerActionTriggerBaseProps,
  type TimerActionTriggerProps,
} from './components/ActionTrigger'
export { TimerArea, type TimerAreaBaseProps, type TimerAreaProps } from './components/Area'
export { TimerContext, type TimerContextProps } from './components/Context'
export { TimerControl, type TimerControlBaseProps, type TimerControlProps } from './components/Control'
export { TimerItem, type TimerItemBaseProps, type TimerItemProps } from './components/Item'
export { TimerRoot, type TimerRootBaseProps, type TimerRootProps } from './components/Root'
export {
  TimerRootProvider,
  type TimerRootProviderBaseProps,
  type TimerRootProviderProps,
} from './components/RootProvider'
export {
  TimerSeparator,
  type TimerSeparatorBaseProps,
  type TimerSeparatorProps,
} from './components/Separator'
export { useTimer, type UseTimerProps, type UseTimerReturn } from './hooks/use-timer'
export { useTimerContext, type UseTimerContext } from './hooks/use-timer-context'

export * as Timer from './namespace'

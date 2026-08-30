export { stepsAnatomy } from './anatomy'
export {
  StepsCompletedContent,
  type StepsCompletedContentBaseProps,
  type StepsCompletedContentProps,
} from './components/CompletedContent'
export { StepsContent, type StepsContentBaseProps, type StepsContentProps } from './components/Content'
export { StepsContext, type StepsContextProps } from './components/Context'
export {
  StepsIndicator,
  type StepsIndicatorBaseProps,
  type StepsIndicatorProps,
} from './components/Indicator'
export { StepsItem, type StepsItemBaseProps, type StepsItemProps } from './components/Item'
export { StepsItemContext, type StepsItemContextProps } from './components/ItemContext'
export { StepsList, type StepsListBaseProps, type StepsListProps } from './components/List'
export {
  StepsNextTrigger,
  type StepsNextTriggerBaseProps,
  type StepsNextTriggerProps,
} from './components/NextTrigger'
export {
  StepsPrevTrigger,
  type StepsPrevTriggerBaseProps,
  type StepsPrevTriggerProps,
} from './components/PrevTrigger'
export {
  StepsProgress,
  type StepsProgressBaseProps,
  type StepsProgressProps,
} from './components/Progress'
export { StepsRoot, type StepsRootBaseProps, type StepsRootProps } from './components/Root'
export {
  StepsRootProvider,
  type StepsRootProviderBaseProps,
  type StepsRootProviderProps,
} from './components/RootProvider'
export {
  StepsSeparator,
  type StepsSeparatorBaseProps,
  type StepsSeparatorProps,
} from './components/Separator'
export { StepsTrigger, type StepsTriggerBaseProps, type StepsTriggerProps } from './components/Trigger'
export { splitStepsProps } from './hooks/split-steps-props'
export { useSteps, type UseStepsProps, type UseStepsReturn } from './hooks/use-steps'
export { useStepsContext, type UseStepsContext } from './hooks/use-steps-context'
export { useStepsItemContext, type UseStepsItemContext } from './hooks/use-steps-item-context'
export {
  useStepsItemPropsContext,
  type UseStepsItemPropsContext,
} from './hooks/use-steps-item-props-context'
export * as Steps from './namespace'

export type { StepChangeDetails } from '@destyler/steps'

export { stepsAnatomy } from './anatomy'
export {
  default as StepsCompletedContent,
  type StepsCompletedContentBaseProps,
  type StepsCompletedContentProps,
} from './components/CompletedContent.svelte'
export { default as StepsContent, type StepsContentBaseProps, type StepsContentProps } from './components/Content.svelte'
export { default as StepsContext, type StepsContextProps } from './components/Context.svelte'
export {
  default as StepsIndicator,
  type StepsIndicatorBaseProps,
  type StepsIndicatorProps,
} from './components/Indicator.svelte'
export { default as StepsItem, type StepsItemBaseProps, type StepsItemProps } from './components/Item.svelte'
export { default as StepsItemContext, type StepsItemContextProps } from './components/ItemContext.svelte'
export { default as StepsList, type StepsListBaseProps, type StepsListProps } from './components/List.svelte'
export {
  default as StepsNextTrigger,
  type StepsNextTriggerBaseProps,
  type StepsNextTriggerProps,
} from './components/NextTrigger.svelte'
export {
  default as StepsPrevTrigger,
  type StepsPrevTriggerBaseProps,
  type StepsPrevTriggerProps,
} from './components/PrevTrigger.svelte'
export { default as StepsProgress, type StepsProgressBaseProps, type StepsProgressProps } from './components/Progress.svelte'
export { default as StepsRoot, type StepsRootBaseProps, type StepsRootProps } from './components/Root.svelte'
export {
  default as StepsRootProvider,
  type StepsRootProviderBaseProps,
  type StepsRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as StepsSeparator,
  type StepsSeparatorBaseProps,
  type StepsSeparatorProps,
} from './components/Separator.svelte'
export { default as StepsTrigger, type StepsTriggerBaseProps, type StepsTriggerProps } from './components/Trigger.svelte'
export { splitStepsProps } from './hooks/split-steps-props.svelte'
export { useStepsContext, type UseStepsContext } from './hooks/use-steps-context'
export { useStepsItemContext, type UseStepsItemContext } from './hooks/use-steps-item-context'
export { useStepsItemPropsContext, type UseStepsItemPropsContext } from './hooks/use-steps-item-props-context'
export { useSteps, type UseStepsProps, type UseStepsReturn } from './hooks/use-steps.svelte'
export * as Steps from './namespace'

export type { StepChangeDetails as StepsStepChangeDetails } from '@destyler/steps'

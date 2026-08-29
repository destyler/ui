export { toggleAnatomy } from './anatomy'
export { default as ToggleContext, type ToggleContextProps } from './components/Context.svelte'
export {
  default as ToggleIndicator,
  type ToggleIndicatorBaseProps,
  type ToggleIndicatorProps,
} from './components/Indicator.svelte'
export { default as ToggleRoot, type ToggleRootBaseProps, type ToggleRootProps } from './components/Root.svelte'
export { useToggleContext, type UseToggleContext } from './hooks/use-toggle-context'
export { useToggle, type UseToggleProps, type UseToggleReturn } from './hooks/use-toggle.svelte'

export * as Toggle from './namespace'

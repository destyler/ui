export { switchAnatomy } from './anatomy'
export { default as SwitchContext, type SwitchContextProps } from './components/Context.svelte'
export { default as SwitchControl, type SwitchControlBaseProps, type SwitchControlProps } from './components/Control.svelte'
export {
  default as SwitchHiddenInput,
  type SwitchHiddenInputBaseProps,
  type SwitchHiddenInputProps,
} from './components/HiddenInput.svelte'
export { default as SwitchLabel, type SwitchLabelBaseProps, type SwitchLabelProps } from './components/Label.svelte'
export { default as SwitchRoot, type SwitchRootBaseProps, type SwitchRootProps } from './components/Root.svelte'
export {
  default as SwitchRootProvider,
  type SwitchRootProviderBaseProps,
  type SwitchRootProviderProps,
} from './components/RootProvider.svelte'
export { default as SwitchThumb, type SwitchThumbBaseProps, type SwitchThumbProps } from './components/Thumb.svelte'
export { useSwitchContext, type UseSwitchContext } from './hooks/use-switch-context'
export { useSwitch, type UseSwitchProps, type UseSwitchReturn } from './hooks/use-switch.svelte'
export * as Switch from './namespace'

export type { CheckedChangeDetails as SwitchCheckedChangeDetails } from '@destyler/switch'

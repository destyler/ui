export { switchAnatomy } from './anatomy'
export { SwitchContext, type SwitchContextProps } from './components/Context'
export {
  SwitchControl,
  type SwitchControlBaseProps,
  type SwitchControlProps,
} from './components/Control'
export {
  SwitchHiddenInput,
  type SwitchHiddenInputBaseProps,
  type SwitchHiddenInputProps,
} from './components/HiddenInput'
export { SwitchLabel, type SwitchLabelBaseProps, type SwitchLabelProps } from './components/Label'
export { SwitchRoot, type SwitchRootBaseProps, type SwitchRootProps } from './components/Root'
export {
  SwitchRootProvider,
  type SwitchRootProviderBaseProps,
  type SwitchRootProviderProps,
} from './components/RootProvider'
export { SwitchThumb, type SwitchThumbBaseProps, type SwitchThumbProps } from './components/Thumb'
export { useSwitch, type UseSwitchProps, type UseSwitchReturn } from './hooks/use-switch'
export { useSwitchContext, type UseSwitchContext } from './hooks/use-switch-context'
export * as Switch from './namespace'

export type { CheckedChangeDetails as SwitchCheckedChangeDetails } from '@destyler/switch'

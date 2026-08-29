export { sliderAnatomy } from './anatomy'
export { default as SliderContext, type SliderContextProps } from './components/Context.svelte'
export { default as SliderControl, type SliderControlBaseProps, type SliderControlProps } from './components/Control.svelte'
export {
  default as SliderDraggingIndicator,
  type SliderDraggingIndicatorBaseProps,
  type SliderDraggingIndicatorProps,
} from './components/DraggingIndicator.svelte'
export {
  default as SliderHiddenInput,
  type SliderHiddenInputBaseProps,
  type SliderHiddenInputProps,
} from './components/HiddenInput.svelte'
export { default as SliderLabel, type SliderLabelBaseProps, type SliderLabelProps } from './components/Label.svelte'
export { default as SliderMarker, type SliderMarkerBaseProps, type SliderMarkerProps } from './components/Marker.svelte'
export {
  default as SliderMarkerGroup,
  type SliderMarkerGroupBaseProps,
  type SliderMarkerGroupProps,
} from './components/MarkerGroup.svelte'
export { default as SliderRange, type SliderRangeBaseProps, type SliderRangeProps } from './components/Range.svelte'
export { default as SliderRoot, type SliderRootBaseProps, type SliderRootProps } from './components/Root.svelte'
export {
  default as SliderRootProvider,
  type SliderRootProviderBaseProps,
  type SliderRootProviderProps,
} from './components/RootProvider.svelte'
export { default as SliderThumb, type SliderThumbBaseProps, type SliderThumbProps } from './components/Thumb.svelte'
export { default as SliderTrack, type SliderTrackBaseProps, type SliderTrackProps } from './components/Track.svelte'
export {
  default as SliderValueText,
  type SliderValueTextBaseProps,
  type SliderValueTextProps,
} from './components/ValueText.svelte'
export { useSliderContext, type UseSliderContext } from './hooks/use-slider-context'
export { useSlider, type UseSliderProps, type UseSliderReturn } from './hooks/use-slider.svelte'
export * as Slider from './namespace'

export type {
  FocusChangeDetails as SliderFocusChangeDetails,
  ValueChangeDetails as SliderValueChangeDetails,
} from '@destyler/slider'

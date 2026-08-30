export { sliderAnatomy } from './anatomy'
export { SliderContext, type SliderContextProps } from './components/Context'
export {
  SliderControl,
  type SliderControlBaseProps,
  type SliderControlProps,
} from './components/Control'
export {
  SliderDraggingIndicator,
  type SliderDraggingIndicatorBaseProps,
  type SliderDraggingIndicatorProps,
} from './components/DraggingIndicator'
export {
  SliderHiddenInput,
  type SliderHiddenInputBaseProps,
  type SliderHiddenInputProps,
} from './components/HiddenInput'
export { SliderLabel, type SliderLabelBaseProps, type SliderLabelProps } from './components/Label'
export { SliderMarker, type SliderMarkerBaseProps, type SliderMarkerProps } from './components/Marker'
export {
  SliderMarkerGroup,
  type SliderMarkerGroupBaseProps,
  type SliderMarkerGroupProps,
} from './components/MarkerGroup'
export { SliderRange, type SliderRangeBaseProps, type SliderRangeProps } from './components/Range'
export { SliderRoot, type SliderRootBaseProps, type SliderRootProps } from './components/Root'
export {
  SliderRootProvider,
  type SliderRootProviderBaseProps,
  type SliderRootProviderProps,
} from './components/RootProvider'
export { SliderThumb, type SliderThumbBaseProps, type SliderThumbProps } from './components/Thumb'
export { SliderTrack, type SliderTrackBaseProps, type SliderTrackProps } from './components/Track'
export {
  SliderValueText,
  type SliderValueTextBaseProps,
  type SliderValueTextProps,
} from './components/ValueText'
export { useSlider, type UseSliderProps, type UseSliderReturn } from './hooks/use-slider'
export { useSliderContext, type UseSliderContext } from './hooks/use-slider-context'
export * as Slider from './namespace'

export type {
  FocusChangeDetails as SliderFocusChangeDetails,
  ValueChangeDetails as SliderValueChangeDetails,
} from '@destyler/slider'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerChannelPropsContext } from '../hooks/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { useColorPickerFormatPropsContext } from '../hooks/use-color-picker-format-context'

export interface ColorPickerChannelSliderTrackBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerChannelSliderTrackProps
  extends HTMLProps<'div'>,
  ColorPickerChannelSliderTrackBaseProps {}

export function ColorPickerChannelSliderTrack(props: ColorPickerChannelSliderTrackProps) {
  const api = useColorPickerContext()

  const formatProps = useColorPickerFormatPropsContext()
  const channelProps = useColorPickerChannelPropsContext()
  const channelSliderProps = mergeProps(channelProps, formatProps)

  const mergedProps = mergeProps(() => api().getChannelSliderTrackProps(channelSliderProps), props)

  return <ui.div {...mergedProps} />
}

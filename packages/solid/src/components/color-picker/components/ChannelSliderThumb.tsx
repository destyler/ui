import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerChannelPropsContext } from '../hooks/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { useColorPickerFormatPropsContext } from '../hooks/use-color-picker-format-context'

export interface ColorPickerChannelSliderThumbBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerChannelSliderThumbProps
  extends HTMLProps<'div'>,
  ColorPickerChannelSliderThumbBaseProps {}

export function ColorPickerChannelSliderThumb(props: ColorPickerChannelSliderThumbProps) {
  const api = useColorPickerContext()

  const formatProps = useColorPickerFormatPropsContext()
  const channelProps = useColorPickerChannelPropsContext()
  const channelSliderProps = mergeProps(channelProps, formatProps)

  const mergedProps = mergeProps(() => api().getChannelSliderThumbProps(channelSliderProps), props)

  return <ui.div {...mergedProps} />
}

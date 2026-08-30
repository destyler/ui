import type { ChannelProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ColorPickerChannelPropsProvider } from '../hooks/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { useColorPickerFormatPropsContext } from '../hooks/use-color-picker-format-context'

export interface ColorPickerChannelSliderBaseProps extends ChannelProps, PolymorphicProps<'div'> {}
export interface ColorPickerChannelSliderProps
  extends HTMLProps<'div'>,
  ColorPickerChannelSliderBaseProps {}

export function ColorPickerChannelSlider(props: ColorPickerChannelSliderProps) {
  const [channelProps, localProps] = createSplitProps<ChannelProps>()(props, [
    'channel',
    'orientation',
  ])

  const api = useColorPickerContext()

  const formatProps = useColorPickerFormatPropsContext()
  const channelSliderProps = mergeProps(channelProps, formatProps)

  const mergedProps = mergeProps(() => api().getChannelSliderProps(channelSliderProps), localProps)

  return (
    <ColorPickerChannelPropsProvider value={channelProps}>
      <ui.div {...mergedProps} />
    </ColorPickerChannelPropsProvider>
  )
}

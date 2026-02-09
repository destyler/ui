import type { ChannelProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ColorPickerChannelPropsProvider } from '../hooks/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { useColorPickerFormatPropsContext } from '../hooks/use-color-picker-format-context'

export interface ColorPickerChannelSliderBaseProps extends ChannelProps, PolymorphicProps {}
export interface ColorPickerChannelSliderProps extends HTMLProps<'div'>, ColorPickerChannelSliderBaseProps {}

export const ColorPickerChannelSlider = forwardRef<HTMLDivElement, ColorPickerChannelSliderProps>((props, ref) => {
  const [channelProps, localProps] = createSplitProps<ChannelProps>()(props, ['channel', 'orientation'])

  const colorPicker = useColorPickerContext()

  const formatProps = useColorPickerFormatPropsContext()
  const channelSliderProps = { ...channelProps, ...formatProps }

  const mergedProps = mergeProps(colorPicker.getChannelSliderProps(channelSliderProps), localProps)

  return (
    <ColorPickerChannelPropsProvider value={props}>
      <ui.div {...mergedProps} ref={ref} />
    </ColorPickerChannelPropsProvider>
  )
})

ColorPickerChannelSlider.displayName = 'ColorPickerChannelSlider'

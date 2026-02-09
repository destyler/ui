import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useColorPickerChannelPropsContext } from '../hooks/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { useColorPickerFormatPropsContext } from '../hooks/use-color-picker-format-context'

export interface ColorPickerChannelSliderThumbBaseProps extends PolymorphicProps {}
export interface ColorPickerChannelSliderThumbProps extends HTMLProps<'div'>, ColorPickerChannelSliderThumbBaseProps {}

export const ColorPickerChannelSliderThumb = forwardRef<HTMLDivElement, ColorPickerChannelSliderThumbProps>(
  (props, ref) => {
    const colorPicker = useColorPickerContext()

    const channelProps = useColorPickerChannelPropsContext()
    const formatProps = useColorPickerFormatPropsContext()
    const channelSliderProps = { ...channelProps, ...formatProps }

    const mergedProps = mergeProps(colorPicker.getChannelSliderThumbProps(channelSliderProps), props)

    return <ui.div {...mergedProps} ref={ref} />
  },
)

ColorPickerChannelSliderThumb.displayName = 'ColorPickerChannelSliderThumb'

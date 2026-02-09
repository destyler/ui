import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useColorPickerChannelPropsContext } from '../hooks/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerChannelSliderLabelBaseProps extends PolymorphicProps {}
export interface ColorPickerChannelSliderLabelProps
  extends HTMLProps<'label'>,
  ColorPickerChannelSliderLabelBaseProps {}

export const ColorPickerChannelSliderLabel = forwardRef<HTMLLabelElement, ColorPickerChannelSliderLabelProps>(
  (props, ref) => {
    const colorPicker = useColorPickerContext()
    const channelProps = useColorPickerChannelPropsContext()
    const mergedProps = mergeProps(colorPicker.getChannelSliderLabelProps(channelProps), props)

    return <ui.label {...mergedProps} ref={ref} />
  },
)

ColorPickerChannelSliderLabel.displayName = 'ColorPickerChannelSliderLabel'

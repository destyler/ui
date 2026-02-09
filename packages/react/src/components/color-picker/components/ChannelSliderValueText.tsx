import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useLocaleContext } from '~/providers'
import { useColorPickerChannelPropsContext } from '../hooks/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerChannelSliderValueTextBaseProps extends PolymorphicProps {}
export interface ColorPickerChannelSliderValueTextProps
  extends HTMLProps<'span'>,
  ColorPickerChannelSliderValueTextBaseProps {}

export const ColorPickerChannelSliderValueText = forwardRef<HTMLSpanElement, ColorPickerChannelSliderValueTextProps>(
  (props, ref) => {
    const { locale } = useLocaleContext()
    const colorPicker = useColorPickerContext()
    const channelProps = useColorPickerChannelPropsContext()
    const mergedProps = mergeProps(colorPicker.getChannelSliderValueTextProps(channelProps), props)

    return (
      <ui.span {...mergedProps} ref={ref}>
        {props.children || colorPicker.getChannelValueText(channelProps.channel, locale)}
      </ui.span>
    )
  },
)

ColorPickerChannelSliderValueText.displayName = 'ColorPickerChannelSliderValueText'

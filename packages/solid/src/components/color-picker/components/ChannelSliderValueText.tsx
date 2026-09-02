import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useLocaleContext } from '~/providers'
import { useColorPickerChannelPropsContext } from '../hooks/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerChannelSliderValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface ColorPickerChannelSliderValueTextProps
  extends HTMLProps<'span'>,
  ColorPickerChannelSliderValueTextBaseProps {}

export function ColorPickerChannelSliderValueText(props: ColorPickerChannelSliderValueTextProps) {
  const colorPicker = useColorPickerContext()
  const localeContext = useLocaleContext()
  const channelProps = useColorPickerChannelPropsContext()
  const mergedProps = mergeProps(
    () => colorPicker().getChannelSliderValueTextProps(channelProps),
    props,
  )

  return (
    <ui.span {...mergedProps}>
      {props.children
        ?? colorPicker().getChannelValueText(channelProps.channel, localeContext().locale)}
    </ui.span>
  )
}

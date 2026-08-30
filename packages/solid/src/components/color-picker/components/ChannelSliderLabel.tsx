import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerChannelPropsContext } from '../hooks/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerChannelSliderLabelBaseProps extends PolymorphicProps<'label'> {}
export interface ColorPickerChannelSliderLabelProps
  extends HTMLProps<'label'>,
  ColorPickerChannelSliderLabelBaseProps {}

export function ColorPickerChannelSliderLabel(props: ColorPickerChannelSliderLabelProps) {
  const colorPicker = useColorPickerContext()
  const channelProps = useColorPickerChannelPropsContext()
  const mergedProps = mergeProps(
    () => colorPicker().getChannelSliderLabelProps(channelProps),
    props,
  )

  return <ui.label {...mergedProps} />
}

import type { ChannelInputProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerChannelInputBaseProps
  extends ChannelInputProps,
  PolymorphicProps<'input'> {}
export interface ColorPickerChannelInputProps
  extends HTMLProps<'input'>,
  ColorPickerChannelInputBaseProps {}

export function ColorPickerChannelInput(props: ColorPickerChannelInputProps) {
  const [channelProps, inputProps] = createSplitProps<ChannelInputProps>()(props, [
    'channel',
    'orientation',
  ])
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getChannelInputProps(channelProps), inputProps)

  return <ui.input {...mergedProps} />
}

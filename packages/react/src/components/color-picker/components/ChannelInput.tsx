import type { ChannelInputProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerChannelInputBaseProps extends ChannelInputProps, PolymorphicProps {}
export interface ColorPickerChannelInputProps extends HTMLProps<'input'>, ColorPickerChannelInputBaseProps {}

export const ColorPickerChannelInput = forwardRef<HTMLInputElement, ColorPickerChannelInputProps>((props, ref) => {
  const [channelProps, localProps] = createSplitProps<ChannelInputProps>()(props, ['channel', 'orientation'])
  const colorPicker = useColorPickerContext()
  const mergedProps = mergeProps(colorPicker.getChannelInputProps(channelProps), localProps)

  return <ui.input {...mergedProps} ref={ref} />
})

ColorPickerChannelInput.displayName = 'ColorPickerChannelInput'

import type { AreaProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ColorPickerAreaPropsProvider } from '../hooks/use-color-picker-area-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerAreaBaseProps extends AreaProps, PolymorphicProps<'div'> {}
export interface ColorPickerAreaProps extends HTMLProps<'div'>, ColorPickerAreaBaseProps {}

export function ColorPickerArea(props: ColorPickerAreaProps) {
  const [channelProps, divprops] = createSplitProps<AreaProps>()(props, ['xChannel', 'yChannel'])
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getAreaProps(channelProps), divprops)

  return (
    <ColorPickerAreaPropsProvider value={channelProps}>
      <ui.div {...mergedProps} />
    </ColorPickerAreaPropsProvider>
  )
}

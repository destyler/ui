import type { TransparencyGridProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerTransparencyGridBaseProps
  extends TransparencyGridProps,
  PolymorphicProps<'div'> {}
export interface ColorPickerTransparencyGridProps
  extends HTMLProps<'div'>,
  ColorPickerTransparencyGridBaseProps {}

export function ColorPickerTransparencyGrid(props: ColorPickerTransparencyGridProps) {
  const [gridProps, localProps] = createSplitProps<TransparencyGridProps>()(props, ['size'])
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getTransparencyGridProps(gridProps), localProps)

  return <ui.div {...mergedProps} />
}

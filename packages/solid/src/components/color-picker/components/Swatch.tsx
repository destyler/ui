import type { SwatchProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { ColorPickerSwatchPropsProvider } from '../hooks/use-color-picker-swatch-props-context'

export interface ColorPickerSwatchBaseProps extends SwatchProps, PolymorphicProps<'div'> {}
export interface ColorPickerSwatchProps extends HTMLProps<'div'>, ColorPickerSwatchBaseProps {}

export function ColorPickerSwatch(props: ColorPickerSwatchProps) {
  const [swatchProps, localProps] = createSplitProps<SwatchProps>()(props, [
    'respectAlpha',
    'value',
  ])
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getSwatchProps(swatchProps), localProps)

  return (
    <ColorPickerSwatchPropsProvider value={swatchProps}>
      <ui.div {...mergedProps} />
    </ColorPickerSwatchPropsProvider>
  )
}

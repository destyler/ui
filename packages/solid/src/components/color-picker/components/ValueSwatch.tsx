import type { SwatchProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { ColorPickerSwatchPropsProvider } from '../hooks/use-color-picker-swatch-props-context'

interface ValueSwatchProps extends Omit<SwatchProps, 'value'> {}

export interface ColorPickerValueSwatchBaseProps
  extends ValueSwatchProps,
  PolymorphicProps<'div'> {}
export interface ColorPickerValueSwatchProps
  extends HTMLProps<'div'>,
  ColorPickerValueSwatchBaseProps {}

export function ColorPickerValueSwatch(props: ColorPickerValueSwatchProps) {
  const [{ respectAlpha }, localProps] = createSplitProps<ValueSwatchProps>()(props, [
    'respectAlpha',
  ])
  const colorPicker = useColorPickerContext()
  const swatchProps = createMemo(() => ({
    respectAlpha,
    value: colorPicker().value,
  }))
  const mergedProps = mergeProps(() => colorPicker().getSwatchProps(swatchProps()), localProps)

  return (
    <ColorPickerSwatchPropsProvider value={swatchProps()}>
      <ui.div {...mergedProps} />
    </ColorPickerSwatchPropsProvider>
  )
}

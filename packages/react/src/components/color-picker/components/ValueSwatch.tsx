import type { SwatchProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { ColorPickerSwatchPropsProvider } from '../hooks/use-color-picker-swatch-props-context'

interface ValueSwatchProps extends Omit<SwatchProps, 'value'> {}

export interface ColorPickerValueSwatchBaseProps extends ValueSwatchProps, PolymorphicProps {}
export interface ColorPickerValueSwatchProps extends HTMLProps<'div'>, ColorPickerValueSwatchBaseProps {}

export const ColorPickerValueSwatch = forwardRef<HTMLDivElement, ColorPickerValueSwatchProps>((props, ref) => {
  const [{ respectAlpha }, localProps] = createSplitProps<ValueSwatchProps>()(props, ['respectAlpha'])
  const colorPicker = useColorPickerContext()
  const swatchProps = {
    respectAlpha,
    value: colorPicker.valueAsString,
  }
  const mergedProps = mergeProps(colorPicker.getSwatchProps(swatchProps), localProps)

  return (
    <ColorPickerSwatchPropsProvider value={swatchProps}>
      <ui.div {...mergedProps} ref={ref} />
    </ColorPickerSwatchPropsProvider>
  )
})

ColorPickerValueSwatch.displayName = 'ColorPickerValueSwatch'

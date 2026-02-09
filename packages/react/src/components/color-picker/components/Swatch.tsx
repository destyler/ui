import type { SwatchProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { ColorPickerSwatchPropsProvider } from '../hooks/use-color-picker-swatch-props-context'

export interface ColorPickerSwatchBaseProps extends SwatchProps, PolymorphicProps {}
export interface ColorPickerSwatchProps extends HTMLProps<'div'>, ColorPickerSwatchBaseProps {}

export const ColorPickerSwatch = forwardRef<HTMLDivElement, ColorPickerSwatchProps>((props, ref) => {
  const [swatwchProps, localProps] = createSplitProps<SwatchProps>()(props, ['respectAlpha', 'value'])
  const colorPicker = useColorPickerContext()
  const mergedProps = mergeProps(colorPicker.getSwatchProps(swatwchProps), localProps)

  return (
    <ColorPickerSwatchPropsProvider value={props}>
      <ui.div {...mergedProps} ref={ref} />
    </ColorPickerSwatchPropsProvider>
  )
})

ColorPickerSwatch.displayName = 'ColorPickerSwatch'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { useColorPickerSwatchPropsContext } from '../hooks/use-color-picker-swatch-props-context'

export interface ColorPickerSwatchIndicatorBaseProps extends PolymorphicProps {}
export interface ColorPickerSwatchIndicatorProps extends HTMLProps<'div'>, ColorPickerSwatchIndicatorBaseProps {}

export const ColorPickerSwatchIndicator = forwardRef<HTMLDivElement, ColorPickerSwatchIndicatorProps>((props, ref) => {
  const colorPicker = useColorPickerContext()
  const swatchProps = useColorPickerSwatchPropsContext()
  const mergedProps = mergeProps(colorPicker.getSwatchIndicatorProps(swatchProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ColorPickerSwatchIndicator.displayName = 'ColorPickerSwatchIndicator'

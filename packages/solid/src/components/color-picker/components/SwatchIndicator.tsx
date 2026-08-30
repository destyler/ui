import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { useColorPickerSwatchPropsContext } from '../hooks/use-color-picker-swatch-props-context'

export interface ColorPickerSwatchIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerSwatchIndicatorProps
  extends HTMLProps<'div'>,
  ColorPickerSwatchIndicatorBaseProps {}

export function ColorPickerSwatchIndicator(props: ColorPickerSwatchIndicatorProps) {
  const api = useColorPickerContext()
  const swatchProps = useColorPickerSwatchPropsContext()
  const mergedProps = mergeProps(() => api().getSwatchIndicatorProps(swatchProps), props)

  return <ui.div {...mergedProps} />
}

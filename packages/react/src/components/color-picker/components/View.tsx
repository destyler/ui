import type { ColorFormat } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { colorPickerAnatomy } from '../anatomy'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { ColorPickerFormatPropsProvider } from '../hooks/use-color-picker-format-context'

interface FormatOptions {
  format: ColorFormat
}

export interface ColorPickerViewBaseProps extends FormatOptions, PolymorphicProps {}
export interface ColorPickerViewProps extends HTMLProps<'div'>, ColorPickerViewBaseProps {}

export const ColorPickerView = forwardRef<HTMLDivElement, ColorPickerViewProps>((props, ref) => {
  const colorPicker = useColorPickerContext()
  const [formatProps, restProps] = createSplitProps<FormatOptions>()(props, ['format'])

  if (colorPicker.format !== formatProps.format) {
    return null
  }

  return (
    <ColorPickerFormatPropsProvider value={props}>
      <ui.div ref={ref} data-format={props.format} {...colorPickerAnatomy.build().view.attrs} {...restProps} />
    </ColorPickerFormatPropsProvider>
  )
})

ColorPickerView.displayName = 'ColorPickerView'

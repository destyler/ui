import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerFormatSelectBaseProps extends PolymorphicProps {}
export interface ColorPickerFormatSelectProps extends HTMLProps<'select'>, ColorPickerFormatSelectBaseProps {}

export const ColorPickerFormatSelect = forwardRef<HTMLSelectElement, ColorPickerFormatSelectProps>((props, ref) => {
  const colorPicker = useColorPickerContext()
  const mergedProps = mergeProps(colorPicker.getFormatSelectProps(), props)

  return (
    <ui.select {...mergedProps} ref={ref}>
      {['rgba', 'hsla', 'hsba'].map(format => (
        <ui.option key={format} value={format}>
          {format}
        </ui.option>
      ))}
    </ui.select>
  )
})

ColorPickerFormatSelect.displayName = 'ColorPickerFormatSelect'

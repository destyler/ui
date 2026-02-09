import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerControlBaseProps extends PolymorphicProps {}
export interface ColorPickerControlProps extends HTMLProps<'div'>, ColorPickerControlBaseProps {}

export const ColorPickerControl = forwardRef<HTMLDivElement, ColorPickerControlProps>((props, ref) => {
  const colorPicker = useColorPickerContext()
  const mergedProps = mergeProps(colorPicker.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ColorPickerControl.displayName = 'ColorPickerControl'

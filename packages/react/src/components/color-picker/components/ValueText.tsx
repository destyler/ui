import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerValueTextBaseProps extends PolymorphicProps {}
export interface ColorPickerValueTextProps extends HTMLProps<'span'>, ColorPickerValueTextBaseProps {}

export const ColorPickerValueText = forwardRef<HTMLDivElement, ColorPickerValueTextProps>((props, ref) => {
  const { children, ...localprops } = props
  const colorPicker = useColorPickerContext()
  const mergedProps = mergeProps(colorPicker.getValueTextProps(), localprops)

  return (
    <ui.span {...mergedProps} ref={ref}>
      {props.children || colorPicker.valueAsString}
    </ui.span>
  )
})

ColorPickerValueText.displayName = 'ColorPickerValueText'

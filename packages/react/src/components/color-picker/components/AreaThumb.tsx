import type { HTMLProps, PolymorphicProps } from '~/factory'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useColorPickerAreaPropsContext } from '../hooks/use-color-picker-area-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerAreaThumbBaseProps extends PolymorphicProps {}
export interface ColorPickerAreaThumbProps extends HTMLProps<'div'>, ColorPickerAreaThumbBaseProps {}

export const ColorPickerAreaThumb = forwardRef<HTMLDivElement, ColorPickerAreaThumbProps>((props, ref) => {
  const colorPicker = useColorPickerContext()
  const areaProps = useColorPickerAreaPropsContext()
  const thumbProps = colorPicker.getAreaThumbProps(areaProps)

  return <ui.div {...thumbProps} {...props} ref={ref} />
})

ColorPickerAreaThumb.displayName = 'ColorPickerAreaThumb'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useColorPickerAreaPropsContext } from '../hooks/use-color-picker-area-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerAreaBackgroundBaseProps extends PolymorphicProps {}
export interface ColorPickerAreaBackgroundProps extends HTMLProps<'div'>, ColorPickerAreaBackgroundBaseProps {}

export const ColorPickerAreaBackground = forwardRef<HTMLDivElement, ColorPickerAreaBackgroundProps>((props, ref) => {
  const colorPicker = useColorPickerContext()
  const areaProps = useColorPickerAreaPropsContext()
  const mergedProps = mergeProps(colorPicker.getAreaBackgroundProps(areaProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

ColorPickerAreaBackground.displayName = 'ColorPickerAreaBackground'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerEyeDropperTriggerBaseProps extends PolymorphicProps {}
export interface ColorPickerEyeDropperTriggerProps extends HTMLProps<'button'>, ColorPickerEyeDropperTriggerBaseProps {}

export const ColorPickerEyeDropperTrigger = forwardRef<HTMLButtonElement, ColorPickerEyeDropperTriggerProps>(
  (props, ref) => {
    const colorPicker = useColorPickerContext()
    const mergedProps = mergeProps(colorPicker.getEyeDropperTriggerProps(), props)

    return <ui.button {...mergedProps} ref={ref} />
  },
)

ColorPickerEyeDropperTrigger.displayName = 'ColorPickerEyeDropperTrigger'

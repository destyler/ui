import type { JSX } from 'solid-js'
import type { UseColorPickerContext } from '../hooks/use-color-picker-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerContextProps {
  children: (context: UseColorPickerContext) => JSX.Element
}

export function ColorPickerContext(props: ColorPickerContextProps) {
  return props.children(useColorPickerContext())
}

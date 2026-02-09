import type { ReactNode } from 'react'
import type { UseColorPickerContext } from '../hooks/use-color-picker-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerContextProps {
  children: (context: UseColorPickerContext) => ReactNode
}

export const ColorPickerContext = (props: ColorPickerContextProps) => props.children(useColorPickerContext())

ColorPickerContext.displayName = 'ColorPickerContext'

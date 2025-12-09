import type { ColorFormat } from '@destyler/color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerSwatchPropsContext {
  format: ColorFormat
}

export const [ColorPickerFormatPropsProvider, useColorPickerFormatPropsContext]
  = createContext<UseColorPickerSwatchPropsContext>('ColorPickerFormatProps')

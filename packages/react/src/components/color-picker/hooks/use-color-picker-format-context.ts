import type { ColorFormat } from '@destyler/color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerFormatPropsContext {
  format: ColorFormat
}

export const [ColorPickerFormatPropsProvider, useColorPickerFormatPropsContext]
  = createContext<UseColorPickerFormatPropsContext>({
    name: 'ColorPickerFormatContext',
    hookName: 'useColorPickerFormatPropsContext',
    providerName: '<ColorPickerFormatPropsProvider />',
    strict: false,
  })

import type { ColorFormat } from '@destyler/color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerSwatchPropsContext {
  format: ColorFormat
}

const colorPickerFormatPropsProviderTuple = createContext<UseColorPickerSwatchPropsContext>({
  hookName: 'useColorPickerFormatPropsContext',
  providerName: '<ColorPickerFormatPropsProvider />',
  strict: false,
})

export const ColorPickerFormatPropsProvider = colorPickerFormatPropsProviderTuple[0]
export const useColorPickerFormatPropsContext = colorPickerFormatPropsProviderTuple[1]

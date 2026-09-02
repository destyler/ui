import type { ColorFormat } from '@destyler/color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerFormatPropsContext {
  format: ColorFormat
}

const colorPickerFormatPropsProviderTuple = createContext<UseColorPickerFormatPropsContext>({
  hookName: 'useColorPickerFormatPropsContext',
  providerName: '<ColorPickerFormatPropsProvider />',
  strict: false,
})

export const ColorPickerFormatPropsProvider = colorPickerFormatPropsProviderTuple[0]
export const useColorPickerFormatPropsContext = colorPickerFormatPropsProviderTuple[1]

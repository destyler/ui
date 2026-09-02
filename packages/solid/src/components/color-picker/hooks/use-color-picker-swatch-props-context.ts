import type { SwatchProps } from '@destyler/color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerSwatchPropsContext extends SwatchProps {}

const colorPickerSwatchPropsProviderTuple = createContext<UseColorPickerSwatchPropsContext>({
  hookName: 'useColorPickerSwatchContext',
  providerName: '<ColorPickerSwatchProvider />',
})

export const ColorPickerSwatchPropsProvider = colorPickerSwatchPropsProviderTuple[0]
export const useColorPickerSwatchPropsContext = colorPickerSwatchPropsProviderTuple[1]

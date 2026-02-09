import type { SwatchProps } from '@destyler/color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerSwatchPropsContext extends SwatchProps {}

export const [ColorPickerSwatchPropsProvider, useColorPickerSwatchPropsContext]
  = createContext<UseColorPickerSwatchPropsContext>({
    name: 'ColorPickerSwatchContext',
    hookName: 'useColorPickerSwatchContext',
    providerName: '<ColorPickerSwatchProvider />',
  })

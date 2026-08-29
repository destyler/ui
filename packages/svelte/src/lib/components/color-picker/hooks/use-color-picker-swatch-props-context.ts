import type { Accessor } from '$lib/types'
import type { SwatchProps } from '@destyler/color-picker'
import { createContext } from '$lib/utils/create-context'

export interface UseColorPickerSwatchPropsContext extends Accessor<SwatchProps> {}

export const [ColorPickerSwatchPropsProvider, useColorPickerSwatchPropsContext]
  = createContext<UseColorPickerSwatchPropsContext>({
    name: 'ColorPickerSwatchPropsContext',
    hookName: 'useColorPickerSwatchPropsContext',
    providerName: '<ColorPickerSwatchPropsProvider />',
  })

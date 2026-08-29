import type { Accessor } from '$lib/types'
import type { ColorFormat } from '@destyler/color-picker'
import { createContext } from '$lib/utils/create-context'

export interface UseColorPickerFormatPropsContext extends Accessor<{ format?: ColorFormat }> {}

const EMPTY_OBJ = {}

export const [ColorPickerFormatPropsProvider, useColorPickerFormatPropsContext]
  = createContext<UseColorPickerFormatPropsContext>({
    name: 'ColorPickerFormatContext',
    hookName: 'useColorPickerFormatPropsContext',
    providerName: '<ColorPickerFormatPropsProvider />',
    strict: false,
    defaultValue: () => EMPTY_OBJ,
  })

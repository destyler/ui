import type { Accessor } from '$lib/types'
import type { AreaProps } from '@destyler/color-picker'
import { createContext } from '$lib/utils/create-context'

export interface UseColorPickerAreaPropsContext extends Accessor<AreaProps> {}

export const [ColorPickerAreaPropsProvider, useColorPickerAreaPropsContext]
  = createContext<UseColorPickerAreaPropsContext>({
    name: 'ColorPickerAreaContext',
    hookName: 'useColorPickerAreaContext',
    providerName: '<ColorPickerAreaProvider />',
  })

import type { AreaProps } from '@destyler/color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerAreaContext extends AreaProps {}

const colorPickerAreaPropsProviderTuple = createContext<UseColorPickerAreaContext>({
  hookName: 'useColorPickerAreaContext',
  providerName: '<ColorPickerAreaProvider />',
})

export const ColorPickerAreaPropsProvider = colorPickerAreaPropsProviderTuple[0]
export const useColorPickerAreaPropsContext = colorPickerAreaPropsProviderTuple[1]

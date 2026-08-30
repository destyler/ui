import type { UseColorPickerReturn } from './use-color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerContext extends UseColorPickerReturn {}

const colorPickerProviderTuple = createContext<UseColorPickerContext>({
  hookName: 'useColorPickerContext',
  providerName: '<ColorPickerProvider />',
})

export const ColorPickerProvider = colorPickerProviderTuple[0]
export const useColorPickerContext = colorPickerProviderTuple[1]

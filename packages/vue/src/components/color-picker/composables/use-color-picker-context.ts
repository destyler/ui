import type { UseColorPickerReturn } from './use-color-picker'
import { createContext } from '~/utils'

export interface UseColorPickerContext extends UseColorPickerReturn {}

export const [ColorPickerProvider, useColorPickerContext] = createContext<UseColorPickerContext>('ColorPickerContext')

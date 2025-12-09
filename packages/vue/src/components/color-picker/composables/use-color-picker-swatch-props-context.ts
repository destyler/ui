import type { SwatchProps } from '@destyler/color-picker'
import { createContext } from '~/utils'

export interface ColorPickerSwatchPropsContext extends SwatchProps {}

export const [ColorPickerSwatchPropsProvider, useColorPickerSwatchPropsContext]
  = createContext<ColorPickerSwatchPropsContext>('ColorPickerSwatchPropsContext')

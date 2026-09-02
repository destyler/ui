import type { ChannelProps } from '@destyler/color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerChannelPropsContext extends ChannelProps {}

const colorPickerChannelPropsProviderTuple = createContext<UseColorPickerChannelPropsContext>({
  hookName: 'useColorPickerChannelSliderContext',
  providerName: '<ColorPickerChannelSliderProvider />',
})

export const ColorPickerChannelPropsProvider = colorPickerChannelPropsProviderTuple[0]
export const useColorPickerChannelPropsContext = colorPickerChannelPropsProviderTuple[1]

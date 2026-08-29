import type { Accessor } from '$lib/types'
import type { ChannelProps } from '@destyler/color-picker'
import { createContext } from '$lib/utils/create-context'

export interface UseColorPickerChannelPropsContext extends Accessor<ChannelProps> {}

export const [ColorPickerChannelPropsProvider, useColorPickerChannelPropsContext]
  = createContext<UseColorPickerChannelPropsContext>({
    name: 'ColorPickerChannelPropsContext',
    hookName: 'useColorPickerChannelPropsContext',
    providerName: '<ColorPickerChannelPropsProvider />',
  })

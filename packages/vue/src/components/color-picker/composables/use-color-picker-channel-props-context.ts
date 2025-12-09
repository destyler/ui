import type { ChannelProps } from '@destyler/color-picker'
import { createContext } from '~/utils/create-context'

export interface UseColorPickerChannelPropsContext extends ChannelProps {}

export const [ColorPickerChannelPropsProvider, useColorPickerChannelPropsContext]
  = createContext<UseColorPickerChannelPropsContext>('ColorPickerChannelPropsContext')

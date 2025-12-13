import type { ItemProps } from '@destyler/radio'
import { createContext } from '~/utils'

export interface UseRadioItemPropsContext extends ItemProps {}

export const [RadioItemPropsProvider, useRadioItemPropsContext]
  = createContext<UseRadioItemPropsContext>('RadioItemPropsContext')

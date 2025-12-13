import type { UseRadioReturn } from './use-radio'
import { createContext } from '~/utils'

export interface UseRadioContext extends UseRadioReturn {}

export const [RadioProvider, useRadioContext] = createContext<UseRadioContext>('RadioContext')

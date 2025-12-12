import type { UseNumberInputReturn } from './use-number-input'
import { createContext } from '~/utils'

export interface UseNumberInputContext extends UseNumberInputReturn {}

export const [NumberInputProvider, useNumberInputContext] = createContext<UseNumberInputContext>('NumberInputContext')

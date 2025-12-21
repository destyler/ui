import type { UseSeparatorReturn } from './use-separator'
import { createContext } from '~/utils'

export interface UseSeparatorContext extends UseSeparatorReturn {}

export const [SeparatorProvider, useSeparatorContext] = createContext<UseSeparatorContext>('SeparatorContext')

import type { UseSplitterReturn } from './use-splitter'
import { createContext } from '~/utils'

export interface UseSplitterContext extends UseSplitterReturn {}

export const [SplitterProvider, useSplitterContext] = createContext<UseSplitterContext>('SplitterContext')

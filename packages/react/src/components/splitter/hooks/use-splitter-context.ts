import type { UseSplitterReturn } from './use-splitter'
import { createContext } from '~/utils/create-context'

export interface UseSplitterContext extends UseSplitterReturn {}

export const [SplitterProvider, useSplitterContext] = createContext<UseSplitterContext>({
  name: 'SplitterContext',
  hookName: 'useSplitterContext',
  providerName: '<SplitterProvider />',
})

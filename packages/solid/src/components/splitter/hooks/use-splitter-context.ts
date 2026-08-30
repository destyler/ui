import type { UseSplitterReturn } from './use-splitter'
import { createContext } from '~/utils/create-context'

export interface UseSplitterContext extends UseSplitterReturn {}

const splitterProviderTuple = createContext<UseSplitterContext>({
  hookName: 'useSplitterContext',
  providerName: '<SplitterProvider />',
})

export const SplitterProvider = splitterProviderTuple[0]
export const useSplitterContext = splitterProviderTuple[1]

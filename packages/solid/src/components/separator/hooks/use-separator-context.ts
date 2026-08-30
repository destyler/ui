import type { UseSeparatorReturn } from './use-separator'
import { createContext } from '~/utils/create-context'

export interface UseSeparatorContext extends UseSeparatorReturn {}

const separatorProviderTuple = createContext<UseSeparatorContext>({
  hookName: 'useSeparatorContext',
  providerName: '<SeparatorProvider />',
  strict: false,
})

export const SeparatorProvider = separatorProviderTuple[0]
export const useSeparatorContext = separatorProviderTuple[1]

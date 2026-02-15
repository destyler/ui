import type { UseSeparatorReturn } from './use-separator'
import { createContext } from '~/utils/create-context'

export type UseSeparatorContext = UseSeparatorReturn

export const [SeparatorProvider, useSeparatorContext] = createContext<UseSeparatorContext>({
  name: 'SeparatorContext',
  hookName: 'useSeparatorContext',
  providerName: '<SeparatorProvider />',
  strict: false,
})

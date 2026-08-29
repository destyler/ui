import type { UseSeparatorReturn } from './use-separator.svelte'
import { createContext } from '$lib/utils/create-context'

export type UseSeparatorContext = UseSeparatorReturn
export const [SeparatorProvider, useSeparatorContext] = createContext<UseSeparatorContext>({
  name: 'SeparatorContext',
  hookName: 'useSeparatorContext',
  providerName: '<SeparatorProvider />',
})

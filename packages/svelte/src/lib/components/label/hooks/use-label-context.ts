import type { UseLabelReturn } from './use-label.svelte'
import { createContext } from '$lib/utils/create-context'

export type UseLabelContext = UseLabelReturn
export const [LabelProvider, useLabelContext] = createContext<UseLabelContext>({
  name: 'LabelContext',
  hookName: 'useLabelContext',
  providerName: '<LabelProvider />',
})

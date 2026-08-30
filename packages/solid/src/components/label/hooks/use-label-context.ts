import type { UseLabelReturn } from './use-label'
import { createContext } from '~/utils/create-context'

export interface UseLabelContext extends UseLabelReturn {}

const labelProviderTuple = createContext<UseLabelContext>({
  hookName: 'useLabelContext',
  providerName: '<LabelProvider />',
})

export const LabelProvider = labelProviderTuple[0]
export const useLabelContext = labelProviderTuple[1]

import type { UseLabelReturn } from './use-label'
import { createContext } from '~/utils/create-context'

export type UseLabelContext = UseLabelReturn

export const [LabelProvider, useLabelContext] = createContext<UseLabelContext>({
  name: 'LabelContext',
  hookName: 'useLabelContext',
  providerName: '<LabelProvider />',
})

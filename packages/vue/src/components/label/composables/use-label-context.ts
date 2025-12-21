import type { UseLabelReturn } from './use-label'
import { createContext } from '~/utils'

export interface UseLabelContext extends UseLabelReturn {}

export const [LabelProvider, useLabelContext] = createContext<UseLabelContext>('LabelContext')

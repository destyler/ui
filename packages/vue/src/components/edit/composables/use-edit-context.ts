import type { UseEditReturn } from './use-edit'
import { createContext } from '~/utils'

export interface UseEditContext extends UseEditReturn {}

export const [EditProvider, useEditContext] = createContext<UseEditContext>('EditContext')

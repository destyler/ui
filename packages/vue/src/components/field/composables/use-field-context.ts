import type { UseFieldReturn } from './use-field'
import { createContext } from '~/utils'

export interface UseFieldContext extends UseFieldReturn {}
export const [FieldProvider, useFieldContext] = createContext<UseFieldContext>('FieldContext')

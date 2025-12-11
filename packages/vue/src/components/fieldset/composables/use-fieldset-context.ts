import type { UseFieldsetReturn } from './use-fieldset'
import { createContext } from '~/utils'

export interface UseFieldsetContext extends UseFieldsetReturn {}
export const [FieldsetProvider, useFieldsetContext] = createContext<UseFieldsetContext>('FieldsetContext')

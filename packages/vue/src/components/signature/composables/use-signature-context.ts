import type { UseSignatureReturn } from './use-signature'
import { createContext } from '~/utils'

export interface UseSignatureContext extends UseSignatureReturn {}
export const [SignatureProvider, useSignatureContext]
  = createContext<UseSignatureContext>('SignatureContext')

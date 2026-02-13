import type { UseSignatureReturn } from './use-signature'
import { createContext } from '~/utils/create-context'

export interface UseSignatureContext extends UseSignatureReturn {}

export const [SignatureProvider, useSignatureContext] = createContext<UseSignatureContext>({
  name: 'SignatureContext',
  hookName: 'useSignatureContext',
  providerName: '<SignatureProvider />',
})

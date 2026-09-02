import type { UseSignatureReturn } from './use-signature'
import { createContext } from '~/utils/create-context'

export interface UseSignatureContext extends UseSignatureReturn {}

const signatureProviderTuple = createContext<UseSignatureContext>(
  {
    hookName: 'useSignatureContext',
    providerName: '<SignatureProvider />',
  },
)

export const SignatureProvider = signatureProviderTuple[0]
export const useSignatureContext = signatureProviderTuple[1]

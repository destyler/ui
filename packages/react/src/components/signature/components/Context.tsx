import type { ReactNode } from 'react'
import type { UseSignatureContext } from '../hooks/use-signature-context'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureContextProps {
  children: (context: UseSignatureContext) => ReactNode
}

export const SignatureContext = (props: SignatureContextProps) => props.children(useSignatureContext())

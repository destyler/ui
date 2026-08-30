import type { JSX } from 'solid-js'
import type { UseSignatureContext } from '../hooks/use-signature-context'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureContextProps {
  children: (context: UseSignatureContext) => JSX.Element
}

export function SignatureContext(props: SignatureContextProps) {
  return props.children(useSignatureContext())
}

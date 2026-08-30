import type { JSX } from 'solid-js'
import type { UseSeparatorReturn } from '../hooks/use-separator'
import { SeparatorProvider } from '../hooks/use-separator-context'

export interface SeparatorRootProviderProps {
  value: UseSeparatorReturn
  children?: JSX.Element
}

export function SeparatorRootProvider(props: SeparatorRootProviderProps) {
  const separator: UseSeparatorReturn = () => props.value()
  return <SeparatorProvider value={separator}>{props.children}</SeparatorProvider>
}

import type { JSX } from 'solid-js'
import type { UseSeparatorReturn } from '../hooks/use-separator'
import { SeparatorProvider } from '../hooks/use-separator-context'

export interface SeparatorRootProviderProps {
  value: UseSeparatorReturn
  children?: JSX.Element
}

export function SeparatorRootProvider(props: SeparatorRootProviderProps) {
  return <SeparatorProvider value={props.value}>{props.children}</SeparatorProvider>
}

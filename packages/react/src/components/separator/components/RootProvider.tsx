import type { ReactNode } from 'react'
import type { UseSeparatorReturn } from '../hooks/use-separator'
import { SeparatorProvider } from '../hooks/use-separator-context'

interface RootProviderProps {
  value: UseSeparatorReturn
}

export interface SeparatorRootProviderProps extends RootProviderProps {
  children?: ReactNode
}

export function SeparatorRootProvider(props: SeparatorRootProviderProps) {
  const { value: api, children } = props

  return (
    <SeparatorProvider value={api}>
      {children}
    </SeparatorProvider>
  )
}

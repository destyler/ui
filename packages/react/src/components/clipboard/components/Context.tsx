import type { ReactNode } from 'react'
import type { UseClipboardContext } from '../hooks/use-clipboard-context'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardContextProps {
  children: (context: UseClipboardContext) => ReactNode
}

export const ClipboardContext = (props: ClipboardContextProps) => props.children(useClipboardContext())

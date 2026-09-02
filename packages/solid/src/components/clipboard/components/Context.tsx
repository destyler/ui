import type { JSX } from 'solid-js'
import type { UseClipboardContext } from '../hooks/use-clipboard-context'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardContextProps {
  children: (context: UseClipboardContext) => JSX.Element
}

export function ClipboardContext(props: ClipboardContextProps) {
  return props.children(useClipboardContext())
}

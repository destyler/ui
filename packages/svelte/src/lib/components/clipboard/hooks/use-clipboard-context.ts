import type { UseClipboardReturn } from './use-clipboard.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseClipboardContext extends UseClipboardReturn {}

export const [ClipboardProvider, useClipboardContext] = createContext<UseClipboardContext>({
  name: 'ClipboardContext',
})

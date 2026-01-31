import type { UseClipboardReturn } from './use-clipboard'
import { createContext } from '~/utils/create-context'

export interface UseClipboardContext extends UseClipboardReturn {}

export const [ClipboardProvider, useClipboardContext] = createContext<UseClipboardContext>({
  name: 'ClipboardContext',
  hookName: 'useClipboardContext',
  providerName: '<ClipboardProvider />',
})

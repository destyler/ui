import type { UseClipboardReturn } from './use-clipboard'
import { createContext } from '~/utils/create-context'

export interface UseClipboardContext extends UseClipboardReturn {}

const clipboardProviderTuple = createContext<UseClipboardContext>({
  hookName: 'useClipboardContext',
  providerName: '<ClipboardProvider />',
})

export const ClipboardProvider = clipboardProviderTuple[0]
export const useClipboardContext = clipboardProviderTuple[1]

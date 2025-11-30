import type { UseClipboardReturn } from './use-clipboard'
import { createContext } from '~/utils'

export interface UseClipboardContext extends UseClipboardReturn {}

export const [ClipboardProvider, useClipboardContext] = createContext<UseClipboardContext>('ClipboardContext')

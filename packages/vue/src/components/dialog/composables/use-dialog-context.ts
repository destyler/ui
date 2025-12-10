import type { UseDialogReturn } from './use-dialog'
import { createContext } from '~/utils'

export interface UseDialogContext extends UseDialogReturn {}

export const [DialogProvider, useDialogContext] = createContext<UseDialogContext>('DialogContext')

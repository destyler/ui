import type { UseDialogReturn } from './use-dialog'
import { createContext } from '~/utils/create-context'

export interface UseDialogContext extends UseDialogReturn {}

export const [DialogProvider, useDialogContext] = createContext<UseDialogContext>({
  name: 'DialogContext',
  hookName: 'useDialogContext',
  providerName: '<DialogProvider />',
})

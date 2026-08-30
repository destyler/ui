import type { UseDialogReturn } from './use-dialog'
import { createContext } from '~/utils/create-context'

export interface UseDialogContext extends UseDialogReturn {}

const dialogProviderTuple = createContext<UseDialogContext>({
  hookName: 'useDialogContext',
  providerName: '<DialogProvider />',
})

export const DialogProvider = dialogProviderTuple[0]
export const useDialogContext = dialogProviderTuple[1]

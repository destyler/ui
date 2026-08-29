import type { UseDialogReturn } from './use-dialog.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseDialogContext extends UseDialogReturn {}

export const [DialogProvider, useDialogContext] = createContext<UseDialogContext>({
  name: 'DialogContext',
})

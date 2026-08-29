import type { UseQrCodeReturn } from './use-qr-code.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseQrCodeContext extends UseQrCodeReturn {}
export const [QrCodeProvider, useQrCodeContext] = createContext<UseQrCodeContext>({
  name: 'QrCodeContext',
})

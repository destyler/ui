import type { UseQrCodeReturn } from './use-qr-code'
import { createContext } from '~/utils/create-context'

export interface UseQrCodeContext extends UseQrCodeReturn {}

export const [QrCodeProvider, useQrCodeContext] = createContext<UseQrCodeContext>({
  name: 'QrCodeContext',
  hookName: 'useQrCodeContext',
  providerName: '<QrCodeProvider />',
})

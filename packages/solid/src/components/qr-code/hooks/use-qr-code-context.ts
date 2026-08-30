import type { UseQrCodeReturn } from './use-qr-code'
import { createContext } from '~/utils/create-context'

export interface UseQrCodeContext extends UseQrCodeReturn {}

const qrCodeProviderTuple = createContext<UseQrCodeContext>({
  hookName: 'useQrCodeContext',
  providerName: '<QrCodeProvider />',
})

export const QrCodeProvider = qrCodeProviderTuple[0]
export const useQrCodeContext = qrCodeProviderTuple[1]

import type { UseQrCodeReturn } from './use-qr-code'
import { createContext } from '~/utils'

export interface UseQrCodeContext extends UseQrCodeReturn {}

export const [QrCodeProvider, useQrCodeContext] = createContext<UseQrCodeContext>('QrCodeContext')

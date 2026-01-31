import type { ReactNode } from 'react'
import type { UseQrCodeContext } from '../hooks/use-qr-code-context'
import { useQrCodeContext } from '../hooks/use-qr-code-context'

export interface QrCodeContextProps {
  children: (context: UseQrCodeContext) => ReactNode
}

export const QrCodeContext = (props: QrCodeContextProps) => props.children(useQrCodeContext())

import type { JSX } from 'solid-js'
import type { UseQrCodeContext } from '../hooks/use-qr-code-context'
import { useQrCodeContext } from '../hooks/use-qr-code-context'

export interface QrCodeContextProps {
  children: (context: UseQrCodeContext) => JSX.Element
}

export const QrCodeContext = (props: QrCodeContextProps) => props.children(useQrCodeContext())

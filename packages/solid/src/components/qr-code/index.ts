export { qrCodeAnatomy } from './anatomy'
export { QrCodeContext, type QrCodeContextProps } from './components/Context'
export {
  QrCodeDownloadTrigger,
  type QrCodeDownloadTriggerBaseProps,
  type QrCodeDownloadTriggerProps,
} from './components/DownloadTrigger'
export { QrCodeFrame, type QrCodeFrameBaseProps, type QrCodeFrameProps } from './components/Frame'
export {
  QrCodeOverlay,
  type QrCodeOverlayBaseProps,
  type QrCodeOverlayProps,
} from './components/Overlay'
export {
  QrCodePattern,
  type QrCodePatternBaseProps,
  type QrCodePatternProps,
} from './components/Pattern'
export { QrCodeRoot, type QrCodeRootBaseProps, type QrCodeRootProps } from './components/Root'
export {
  QrCodeRootProvider,
  type QrCodeRootProviderBaseProps,
  type QrCodeRootProviderProps,
} from './components/RootProvider'
export { useQrCode, type UseQrCodeProps, type UseQrCodeReturn } from './hooks/use-qr-code'
export { useQrCodeContext, type UseQrCodeContext } from './hooks/use-qr-code-context'
export * as QrCode from './namespace'

export type { QrCodeGenerateOptions, QrCodeGenerateResult } from '@destyler/qr-code'

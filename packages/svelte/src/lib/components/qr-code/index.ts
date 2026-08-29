export { qrCodeAnatomy } from './anatomy'
export { default as QrCodeContext, type QrCodeContextProps } from './components/Context.svelte'
export {
  default as QrCodeDownloadTrigger,
  type QrCodeDownloadTriggerBaseProps,
  type QrCodeDownloadTriggerProps,
} from './components/DownloadTrigger.svelte'
export { default as QrCodeFrame, type QrCodeFrameBaseProps, type QrCodeFrameProps } from './components/Frame.svelte'
export {
  default as QrCodeOverlay,
  type QrCodeOverlayBaseProps,
  type QrCodeOverlayProps,
} from './components/Overlay.svelte'
export {
  default as QrCodePattern,
  type QrCodePatternBaseProps,
  type QrCodePatternProps,
} from './components/Pattern.svelte'
export { default as QrCodeRoot, type QrCodeRootBaseProps, type QrCodeRootProps } from './components/Root.svelte'
export {
  default as QrCodeRootProvider,
  type QrCodeRootProviderBaseProps,
  type QrCodeRootProviderProps,
} from './components/RootProvider.svelte'
export { useQrCodeContext, type UseQrCodeContext } from './hooks/use-qr-code-context'
export { useQrCode, type UseQrCodeProps, type UseQrCodeReturn } from './hooks/use-qr-code.svelte'
export * as QrCode from './namespace'

export type { QrCodeGenerateOptions, QrCodeGenerateResult } from '@destyler/qr-code'

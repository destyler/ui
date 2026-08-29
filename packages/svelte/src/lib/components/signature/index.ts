export { signatureAnatomy } from './anatomy'
export {
  default as SignatureClearTrigger,
  type SignatureClearTriggerBaseProps,
  type SignatureClearTriggerProps,
} from './components/ClearTrigger.svelte'
export { default as SignatureContext, type SignatureContextProps } from './components/Context.svelte'
export {
  default as SignatureControl,
  type SignatureControlBaseProps,
  type SignatureControlProps,
} from './components/Control.svelte'
export {
  default as SignatureGuide,
  type SignatureGuideBaseProps,
  type SignatureGuideProps,
} from './components/Guide.svelte'
export {
  default as SignatureHiddenInput,
  type SignatureHiddenInputBaseProps,
  type SignatureHiddenInputProps,
} from './components/HiddenInput.svelte'
export {
  default as SignatureLabel,
  type SignatureLabelBaseProps,
  type SignatureLabelProps,
} from './components/Label.svelte'
export {
  default as SignatureRoot,
  type SignatureRootBaseProps,
  type SignatureRootProps,
} from './components/Root.svelte'
export {
  default as SignatureRootProvider,
  type SignatureRootProviderBaseProps,
  type SignatureRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as SignatureSegment,
  type SignatureSegmentBaseProps,
  type SignatureSegmentProps,
} from './components/Segment.svelte'
export { useSignatureContext, type UseSignatureContext } from './hooks/use-signature-context'
export { useSignature, type UseSignatureProps, type UseSignatureReturn } from './hooks/use-signature.svelte'
export * as Signature from './namespace'

export type {
  DrawEndDetails,
  DrawDetails as SignatureDrawDetails,
  DrawEndDetails as SignatureDrawEndDetails,
  DrawingOptions as SignatureDrawingOptions,
} from '@destyler/signature'

export { signatureAnatomy } from './anatomy'
export {
  SignatureClearTrigger,
  type SignatureClearTriggerBaseProps,
  type SignatureClearTriggerProps,
} from './components/ClearTrigger'
export { SignatureContext, type SignatureContextProps } from './components/Context'
export {
  SignatureControl,
  type SignatureControlBaseProps,
  type SignatureControlProps,
} from './components/Control'
export {
  SignatureGuide,
  type SignatureGuideBaseProps,
  type SignatureGuideProps,
} from './components/Guide'
export {
  SignatureHiddenInput,
  type SignatureHiddenInputBaseProps,
  type SignatureHiddenInputProps,
} from './components/HiddenInput'
export {
  SignatureLabel,
  type SignatureLabelBaseProps,
  type SignatureLabelProps,
} from './components/Label'
export {
  SignatureRoot,
  type SignatureRootBaseProps,
  type SignatureRootProps,
} from './components/Root'
export {
  SignatureRootProvider,
  type SignatureRootProviderBaseProps,
  type SignatureRootProviderProps,
} from './components/RootProvider'
export {
  SignatureSegment,
  type SignatureSegmentBaseProps,
  type SignatureSegmentProps,
} from './components/Segment'
export {
  useSignature,
  type UseSignatureProps,
  type UseSignatureReturn,
} from './hooks/use-signature'
export { useSignatureContext, type UseSignatureContext } from './hooks/use-signature-context'
export * as Signature from './namespace'

export type {
  DrawEndDetails,
  DrawDetails as SignatureDrawDetails,
  DrawEndDetails as SignatureDrawEndDetails,
  DrawingOptions as SignatureDrawingOptions,
} from '@destyler/signature'

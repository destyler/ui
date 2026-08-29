export { fileUploadAnatomy } from './anatomy'
export {
  default as FileUploadClearTrigger,
  type FileUploadClearTriggerBaseProps,
  type FileUploadClearTriggerProps,
} from './components/ClearTrigger.svelte'
export { default as FileUploadContext, type FileUploadContextProps } from './components/Context.svelte'
export {
  default as FileUploadDropzone,
  type FileUploadDropzoneBaseProps,
  type FileUploadDropzoneProps,
} from './components/Dropzone.svelte'
export {
  default as FileUploadHiddenInput,
  type FileUploadHiddenInputBaseProps,
  type FileUploadHiddenInputProps,
} from './components/HiddenInput.svelte'
export {
  default as FileUploadItem,
  type FileUploadItemBaseProps,
  type FileUploadItemProps,
} from './components/Item.svelte'
export {
  default as FileUploadItemDeleteTrigger,
  type FileUploadItemDeleteTriggerBaseProps,
  type FileUploadItemDeleteTriggerProps,
} from './components/ItemDeleteTrigger.svelte'
export {
  default as FileUploadItemGroup,
  type FileUploadItemGroupBaseProps,
  type FileUploadItemGroupProps,
} from './components/ItemGroup.svelte'
export {
  default as FileUploadItemName,
  type FileUploadItemNameBaseProps,
  type FileUploadItemNameProps,
} from './components/ItemName.svelte'
export {
  default as FileUploadItemPreview,
  type FileUploadItemPreviewBaseProps,
  type FileUploadItemPreviewProps,
} from './components/ItemPreview.svelte'
export {
  default as FileUploadItemPreviewImage,
  type FileUploadItemPreviewImageBaseProps,
  type FileUploadItemPreviewImageProps,
} from './components/ItemPreviewImage.svelte'
export {
  default as FileUploadItemSizeText,
  type FileUploadItemSizeTextBaseProps,
  type FileUploadItemSizeTextProps,
} from './components/ItemSizeText.svelte'
export {
  default as FileUploadLabel,
  type FileUploadLabelBaseProps,
  type FileUploadLabelProps,
} from './components/Label.svelte'
export {
  default as FileUploadRoot,
  type FileUploadRootBaseProps,
  type FileUploadRootProps,
} from './components/Root.svelte'
export {
  default as FileUploadRootProvider,
  type FileUploadRootProviderBaseProps,
  type FileUploadRootProviderProps,
} from './components/RootProvider.svelte'
export {
  default as FileUploadTrigger,
  type FileUploadTriggerBaseProps,
  type FileUploadTriggerProps,
} from './components/Trigger.svelte'
export { useFileUploadContext, type UseFileUploadContext } from './hooks/use-file-upload-context'
export {
  type UseFileUploadItemPropsContext as UseFileUploadItemContext,
  type UseFileUploadItemPropsContext,
  useFileUploadItemPropsContext,
} from './hooks/use-file-upload-item-props-context'
export { useFileUpload, type UseFileUploadProps, type UseFileUploadReturn } from './hooks/use-file-upload.svelte'
export * as FileUpload from './namespace'

export type {
  FileAcceptDetails as FileUploadFileAcceptDetails,
  FileChangeDetails as FileUploadFileChangeDetails,
  FileRejectDetails as FileUploadFileRejectDetails,
  FileValidateDetails as FileUploadFileValidateDetails,
} from '@destyler/file-upload'

export { fileUploadAnatomy } from './anatomy'

export {
  default as FileUploadClearTrigger,
  type FileUploadClearTriggerProps,
} from './components/ClearTrigger.vue'
export {
  default as FileUploadContext,
  type FileUploadContextProps,
} from './components/Context.vue'
export {
  default as FileUploadDropzone,
  type FileUploadDropzoneProps,
} from './components/Dropzone.vue'
export {
  default as FileUploadHiddenInput,
  type FileUploadHiddenInputProps,
} from './components/HiddenInput.vue'
export {
  default as FileUploadItem,
  type FileUploadItemProps,
} from './components/Item.vue'
export {
  default as FileUploadItemDeleteTrigger,
  type FileUploadItemDeleteTriggerProps,
} from './components/ItemDeleteTrigger.vue'
export {
  default as FileUploadItemGroup,
  type FileUploadItemGroupProps,
} from './components/ItemGroup.vue'
export {
  default as FileUploadItemName,
  type FileUploadItemNameProps,
} from './components/ItemName.vue'
export {
  default as FileUploadItemPreview,
  type FileUploadItemPreviewProps,
} from './components/ItemPreview.vue'
export {
  default as FileUploadItemPreviewImage,
  type FileUploadItemPreviewImageProps,
} from './components/ItemPreviewImage.vue'
export {
  default as FileUploadItemSizeText,
  type FileUploadItemSizeTextProps,
} from './components/ItemSizeText.vue'
export {
  default as FileUploadLabel,
  type FileUploadLabelProps,
} from './components/Label.vue'
export {
  default as FileUploadRoot,
  type FileUploadRootEmits,
  type FileUploadRootProps,
} from './components/Root.vue'
export {
  default as FileUploadRootProvider,
  type FileUploadRootProviderProps,
} from './components/RootProvider.vue'
export {
  default as FileUploadTrigger,
  type FileUploadTriggerProps,
} from './components/Trigger.vue'

export {
  useFileUpload,
  type UseFileUploadProps,
  type UseFileUploadReturn,
} from './composables/use-file-upload'
export {
  useFileUploadContext,
  type UseFileUploadContext,
} from './composables/use-file-upload-context'

export * as FileUpload from './namespace'

export type {
  FileAcceptDetails as FileUploadFileAcceptDetails,
  FileChangeDetails as FileUploadFileChangeDetails,
  FileRejectDetails as FileUploadFileRejectDetails,
  FileValidateDetails as FileUploadFileValidateDetails,
} from '@destyler/file-upload'

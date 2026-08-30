import type { JSX } from 'solid-js'
import type { UseFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadContextProps {
  children: (context: UseFileUploadContext) => JSX.Element
}

export function FileUploadContext(props: FileUploadContextProps) {
  return props.children(useFileUploadContext())
}

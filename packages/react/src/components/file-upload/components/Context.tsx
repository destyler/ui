import type { ReactNode } from 'react'
import type { UseFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadContextProps {
  children: (context: UseFileUploadContext) => ReactNode
}

export const FileUploadContext = (props: FileUploadContextProps) => props.children(useFileUploadContext())

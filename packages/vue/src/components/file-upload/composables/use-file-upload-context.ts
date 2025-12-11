import type { UseFileUploadReturn } from './use-file-upload'
import { createContext } from '~/utils'

export interface UseFileUploadContext extends UseFileUploadReturn {}

export const [FileUploadProvider, useFileUploadContext] = createContext<UseFileUploadContext>('FileUploadContext')

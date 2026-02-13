import type { UseFileUploadReturn } from './use-file-upload'
import { createContext } from '~/utils/create-context'

export interface UseFileUploadContext extends UseFileUploadReturn {}

export const [FileUploadProvider, useFileUploadContext] = createContext<UseFileUploadContext>({
  name: 'FileUploadContext',
  hookName: 'useFileUploadContext',
  providerName: '<FileUploadProvider />',
})

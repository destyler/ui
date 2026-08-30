import type { UseFileUploadReturn } from './use-file-upload'
import { createContext } from '~/utils/create-context'

export interface UseFileUploadContext extends UseFileUploadReturn {}

const fileUploadProviderTuple = createContext<UseFileUploadContext>({
  hookName: 'useFileUploadContext',
  providerName: '<FileUploadProvider />',
})

export const FileUploadProvider = fileUploadProviderTuple[0]
export const useFileUploadContext = fileUploadProviderTuple[1]

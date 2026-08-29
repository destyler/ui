import type { UseFileUploadReturn } from './use-file-upload.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseFileUploadContext extends UseFileUploadReturn {}
export const [FileUploadProvider, useFileUploadContext] = createContext<UseFileUploadContext>({
  name: 'FileUploadContext',
})

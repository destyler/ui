import type { ItemProps } from '@destyler/file-upload'
import { createContext } from '~/utils/create-context'

export interface UseFileUploadItemContext extends ItemProps {}

export const [FileUploadItemPropsProvider, useFileUploadItemPropsContext] = createContext<UseFileUploadItemContext>({
  name: 'FileUploadItemPropsContext',
  hookName: 'useFileUploadItemPropsContext',
  providerName: '<FileUploadItemPropsProvider />',
})

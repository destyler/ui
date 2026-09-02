import type { ItemProps } from '@destyler/file-upload'
import { createContext } from '~/utils/create-context'

export interface UseFileUploadItemPropsContext extends ItemProps {}

const fileUploadItemPropsProviderTuple = createContext<UseFileUploadItemPropsContext>({
  hookName: 'useFileUploadItemPropsContext',
  providerName: '<FileUploadItemPropsProvider />',
})

export const FileUploadItemPropsProvider = fileUploadItemPropsProviderTuple[0]
export const useFileUploadItemPropsContext = fileUploadItemPropsProviderTuple[1]

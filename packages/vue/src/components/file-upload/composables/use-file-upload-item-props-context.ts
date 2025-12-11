import type { ItemProps } from '@destyler/file-upload'
import { createContext } from '~/utils'

export interface UseFileUploadItemPropsContext extends ItemProps {}

export const [FileUploadItemPropsProvider, useFileUploadItemPropsContext]
  = createContext<UseFileUploadItemPropsContext>('FileUploadItemPropsContext')

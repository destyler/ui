import type { Accessor } from '$lib/types'
import type { ItemProps } from '@destyler/file-upload'
import { createContext } from '$lib/utils/create-context'

export interface UseFileUploadItemPropsContext extends Accessor<ItemProps> {}
export const [FileUploadItemPropsProvider, useFileUploadItemPropsContext]
  = createContext<UseFileUploadItemPropsContext>({
    name: 'FileUploadItemPropsContext',
  })

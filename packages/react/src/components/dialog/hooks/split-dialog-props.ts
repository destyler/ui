import type { UseDialogProps } from './use-dialog'
import { splitProps as splitDialogPropsBase } from '@destyler/dialog'
import { createSplitProps } from '~/utils/create-split-props'

export function splitDialogProps<T extends UseDialogProps>(props: T) {
  const [dialogContextProps, restProps] = splitDialogPropsBase(props)
  const [specificProps, localProps] = createSplitProps<{
    defaultOpen?: boolean
  }>()(restProps, ['defaultOpen'])

  return [
    { ...dialogContextProps, ...specificProps } as UseDialogProps,
    localProps,
  ] as const
}

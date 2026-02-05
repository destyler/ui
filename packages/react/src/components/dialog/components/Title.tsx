import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogTitleBaseProps extends PolymorphicProps {}
export interface DialogTitleProps extends HTMLProps<'h2'>, DialogTitleBaseProps {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>((props, ref) => {
  const dialog = useDialogContext()
  const mergedProps = mergeProps(dialog.getTitleProps(), props)

  return <ui.h2 {...mergedProps} ref={ref} />
})

DialogTitle.displayName = 'DialogTitle'

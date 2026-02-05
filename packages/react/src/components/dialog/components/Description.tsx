import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogDescriptionBaseProps extends PolymorphicProps {}
export interface DialogDescriptionProps extends HTMLProps<'div'>, DialogDescriptionBaseProps {}

export const DialogDescription = forwardRef<HTMLDivElement, DialogDescriptionProps>((props, ref) => {
  const dialog = useDialogContext()
  const mergedProps = mergeProps(dialog.getDescriptionProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

DialogDescription.displayName = 'DialogDescription'

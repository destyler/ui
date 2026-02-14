import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditPreviewBaseProps extends PolymorphicProps {}
export interface EditPreviewProps extends HTMLProps<'span'>, EditPreviewBaseProps {}

export const EditPreview = forwardRef<HTMLSpanElement, EditPreviewProps>((props, ref) => {
  const editable = useEditContext()
  const mergedProps = mergeProps(editable.getPreviewProps(), props)

  return <ui.span {...mergedProps} ref={ref} />
})

EditPreview.displayName = 'EditPreview'

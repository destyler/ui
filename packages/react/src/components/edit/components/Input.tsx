import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditInputBaseProps extends PolymorphicProps {}
export interface EditInputProps extends HTMLProps<'input'>, EditInputBaseProps {}

export const EditInput = forwardRef<HTMLInputElement, EditInputProps>((props, ref) => {
  const editable = useEditContext()
  const mergedProps = mergeProps(editable.getInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.ariaDescribedby} {...mergedProps} ref={ref} />
})

EditInput.displayName = 'EditInput'

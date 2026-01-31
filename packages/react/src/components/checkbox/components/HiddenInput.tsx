import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

export interface CheckboxHiddenInputBaseProps extends PolymorphicProps {}
export interface CheckboxHiddenInputProps extends HTMLProps<'input'>, CheckboxHiddenInputBaseProps {}

export const CheckboxHiddenInput = forwardRef<HTMLInputElement, CheckboxHiddenInputProps>((props, ref) => {
  const checkbox = useCheckboxContext()
  const mergedProps = mergeProps(checkbox.getHiddenInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.ariaDescribedby} {...mergedProps} ref={ref} />
})

CheckboxHiddenInput.displayName = 'CheckboxHiddenInput'

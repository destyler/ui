import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldInputBaseProps extends PolymorphicProps {}
export interface FieldInputProps extends HTMLProps<'input'>, FieldInputBaseProps {}

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>((props, ref) => {
  const field = useFieldContext()
  const mergedProps = mergeProps<HTMLProps<'input'>>(field?.getInputProps(), props)

  return <ui.input {...mergedProps} ref={ref} />
})

FieldInput.displayName = 'FieldInput'

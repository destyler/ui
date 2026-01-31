import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldErrorTextBaseProps extends PolymorphicProps {}
export interface FieldErrorTextProps extends HTMLProps<'span'>, FieldErrorTextBaseProps {}

export const FieldErrorText = forwardRef<HTMLSpanElement, FieldErrorTextProps>((props, ref) => {
  const field = useFieldContext()
  const mergedProps = mergeProps(field.getErrorTextProps(), props)

  if (field?.invalid) {
    return <ui.span {...mergedProps} ref={ref} />
  }
  return null
})

FieldErrorText.displayName = 'FieldErrorText'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFieldsetContext } from '../hooks/use-fieldset-context'

export interface FieldsetErrorTextBaseProps extends PolymorphicProps {}
export interface FieldsetErrorTextProps extends HTMLProps<'span'>, FieldsetErrorTextBaseProps {}

export const FieldsetErrorText = forwardRef<HTMLSpanElement, FieldsetErrorTextProps>((props, ref) => {
  const fieldset = useFieldsetContext()
  const mergedProps = mergeProps(fieldset.getErrorTextProps(), props)

  return fieldset.invalid ? <ui.span {...mergedProps} ref={ref} /> : null
})

FieldsetErrorText.displayName = 'FieldsetErrorText'

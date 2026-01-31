import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldLabelBaseProps extends PolymorphicProps {}
export interface FieldLabelProps extends HTMLProps<'label'>, FieldLabelBaseProps {}

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>((props, ref) => {
  const field = useFieldContext()
  const mergedProps = mergeProps<HTMLProps<'label'>>(field?.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

FieldLabel.displayName = 'FieldLabel'

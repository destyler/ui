import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldSelectBaseProps extends PolymorphicProps {}
export interface FieldSelectProps extends HTMLProps<'select'>, FieldSelectBaseProps {}

export const FieldSelect = forwardRef<HTMLSelectElement, FieldSelectProps>((props, ref) => {
  const field = useFieldContext()
  const mergedProps = mergeProps<HTMLProps<'select'>>(field?.getSelectProps(), props)

  return <ui.select {...mergedProps} ref={ref} />
})

FieldSelect.displayName = 'FieldSelect'

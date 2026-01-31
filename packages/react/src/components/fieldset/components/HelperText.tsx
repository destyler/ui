import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFieldsetContext } from '../hooks/use-fieldset-context'

export interface FieldsetHelperTextBaseProps extends PolymorphicProps {}
export interface FieldsetHelperTextProps extends HTMLProps<'span'>, FieldsetHelperTextBaseProps {}

export const FieldsetHelperText = forwardRef<HTMLSpanElement, FieldsetHelperTextProps>((props, ref) => {
  const fieldset = useFieldsetContext()
  const mergedProps = mergeProps(fieldset.getHelperTextProps(), props)

  return <ui.span {...mergedProps} ref={ref} />
})

FieldsetHelperText.displayName = 'FieldsetHelperText'

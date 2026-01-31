import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

export interface CheckboxLabelBaseProps extends PolymorphicProps {}
export interface CheckboxLabelProps extends HTMLProps<'span'>, CheckboxLabelBaseProps {}

export const CheckboxLabel = forwardRef<HTMLSpanElement, CheckboxLabelProps>((props, ref) => {
  const checkbox = useCheckboxContext()
  const mergedProps = mergeProps(checkbox.getLabelProps(), props)

  return <ui.span {...mergedProps} ref={ref} />
})

CheckboxLabel.displayName = 'CheckboxLabel'

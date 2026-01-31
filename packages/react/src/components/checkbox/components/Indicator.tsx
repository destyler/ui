import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

export interface CheckboxIndicatorBaseProps extends PolymorphicProps {
  indeterminate?: boolean
}
export interface CheckboxIndicatorProps extends HTMLProps<'div'>, CheckboxIndicatorBaseProps {}

export const CheckboxIndicator = forwardRef<HTMLDivElement, CheckboxIndicatorProps>((props, ref) => {
  const { indeterminate, ...rest } = props
  const checkbox = useCheckboxContext()
  const mergedProps = mergeProps(checkbox.getIndicatorProps(), rest)
  const isVisible = indeterminate ? checkbox.indeterminate : checkbox.checked

  return <ui.div {...mergedProps} hidden={!isVisible} ref={ref} />
})

CheckboxIndicator.displayName = 'CheckboxIndicator'

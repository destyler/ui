import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

export interface CheckboxControlBaseProps extends PolymorphicProps {}
export interface CheckboxControlProps extends HTMLProps<'div'>, CheckboxControlBaseProps {}

export const CheckboxControl = forwardRef<HTMLDivElement, CheckboxControlProps>((props, ref) => {
  const checkbox = useCheckboxContext()
  const mergedProps = mergeProps(checkbox.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

CheckboxControl.displayName = 'CheckboxControl'

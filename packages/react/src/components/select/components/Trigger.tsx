import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectTriggerBaseProps extends PolymorphicProps {}
export interface SelectTriggerProps extends HTMLProps<'button'>, SelectTriggerBaseProps {}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>((props, ref) => {
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

SelectTrigger.displayName = 'SelectTrigger'

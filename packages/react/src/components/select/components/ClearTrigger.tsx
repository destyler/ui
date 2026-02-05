import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectClearTriggerBaseProps extends PolymorphicProps {}
export interface SelectClearTriggerProps extends HTMLProps<'button'>, SelectClearTriggerBaseProps {}

export const SelectClearTrigger = forwardRef<HTMLButtonElement, SelectClearTriggerProps>((props, ref) => {
  const select = useSelectContext()
  const mergedProps = mergeProps(select.getClearTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

SelectClearTrigger.displayName = 'SelectClearTrigger'

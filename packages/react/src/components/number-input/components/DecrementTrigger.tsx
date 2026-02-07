import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputDecrementTriggerBaseProps extends PolymorphicProps {}
export interface NumberInputDecrementTriggerProps extends HTMLProps<'button'>, NumberInputDecrementTriggerBaseProps {}

export const NumberInputDecrementTrigger = forwardRef<HTMLButtonElement, NumberInputDecrementTriggerProps>(
  (props, ref) => {
    const numberInput = useNumberInputContext()
    const mergedProps = mergeProps(numberInput.getDecrementTriggerProps(), props)

    return <ui.button {...mergedProps} ref={ref} />
  },
)

NumberInputDecrementTrigger.displayName = 'NumberInputDecrementTrigger'

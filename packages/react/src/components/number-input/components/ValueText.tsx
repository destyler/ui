import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputValueTextBaseProps extends PolymorphicProps {}
export interface NumberInputValueTextProps extends HTMLProps<'span'>, NumberInputValueTextBaseProps {}

export const NumberInputValueText = forwardRef<HTMLSpanElement, NumberInputValueTextProps>((props, ref) => {
  const { children, ...localProps } = props
  const numberInput = useNumberInputContext()
  const mergedProps = mergeProps(numberInput.getValueTextProps(), localProps)

  return (
    <ui.span {...mergedProps} ref={ref}>
      {children || numberInput.value}
    </ui.span>
  )
})

NumberInputValueText.displayName = 'NumberInputValueText'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'
import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

export interface RadioItemHiddenInputBaseProps extends PolymorphicProps {}
export interface RadioItemHiddenInputProps extends HTMLProps<'input'>, RadioItemHiddenInputBaseProps {}

export const RadioItemHiddenInput = forwardRef<HTMLInputElement, RadioItemHiddenInputProps>((props, ref) => {
  const Radio = useRadioContext()
  const itemProps = useRadioItemPropsContext()
  const mergedProps = mergeProps(Radio.getItemHiddenInputProps(itemProps), props)

  return <ui.input {...mergedProps} ref={ref} />
})

RadioItemHiddenInput.displayName = 'RadioItemHiddenInput'

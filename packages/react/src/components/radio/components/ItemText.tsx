import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'
import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

export interface RadioItemTextBaseProps extends PolymorphicProps {}
export interface RadioItemTextProps extends HTMLProps<'span'>, RadioItemTextBaseProps {}

export const RadioItemText = forwardRef<HTMLSpanElement, RadioItemTextProps>((props, ref) => {
  const Radio = useRadioContext()
  const itemProps = useRadioItemPropsContext()
  const mergedProps = mergeProps(Radio.getItemTextProps(itemProps), props)

  return <ui.span {...mergedProps} ref={ref} />
})

RadioItemText.displayName = 'RadioItemText'

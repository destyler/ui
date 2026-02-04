import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useRadioContext } from '../hooks/use-radio-context'
import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

export interface RadioItemControlBaseProps extends PolymorphicProps {}
export interface RadioItemControlProps extends HTMLProps<'div'>, RadioItemControlBaseProps {}

export const RadioItemControl = forwardRef<HTMLDivElement, RadioItemControlProps>((props, ref) => {
  const Radio = useRadioContext()
  const itemProps = useRadioItemPropsContext()
  const mergedProps = mergeProps(Radio.getItemControlProps(itemProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

RadioItemControl.displayName = 'RadioItemControl'

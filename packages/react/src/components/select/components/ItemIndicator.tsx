import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'
import { useSelectItemPropsContext } from '../hooks/use-select-item-props-context'

export interface SelectItemIndicatorBaseProps extends PolymorphicProps {}
export interface SelectItemIndicatorProps extends HTMLProps<'div'>, SelectItemIndicatorBaseProps {}

export const SelectItemIndicator = forwardRef<HTMLDivElement, SelectItemIndicatorProps>((props, ref) => {
  const select = useSelectContext()
  const itemProps = useSelectItemPropsContext()
  const mergedProps = mergeProps(select.getItemIndicatorProps(itemProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SelectItemIndicator.displayName = 'SelectItemIndicator'

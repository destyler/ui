import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'
import { useSelectItemPropsContext } from '../hooks/use-select-item-props-context'

export interface SelectItemTextBaseProps extends PolymorphicProps {}
export interface SelectItemTextProps extends HTMLProps<'span'>, SelectItemTextBaseProps {}

export const SelectItemText = forwardRef<HTMLDivElement, SelectItemTextProps>((props, ref) => {
  const select = useSelectContext()
  const itemProps = useSelectItemPropsContext()
  const mergedProps = mergeProps(select.getItemTextProps(itemProps), props)

  return <ui.span {...mergedProps} ref={ref} />
})

SelectItemText.displayName = 'SelectItemText'

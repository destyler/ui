import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'
import { useSelectItemGroupPropsContext } from '../hooks/use-select-item-group-props'

export interface SelectItemGroupLabelBaseProps extends PolymorphicProps {}
export interface SelectItemGroupLabelProps extends HTMLProps<'div'>, SelectItemGroupLabelBaseProps {}

export const SelectItemGroupLabel = forwardRef<HTMLDivElement, SelectItemGroupLabelProps>((props, ref) => {
  const select = useSelectContext()
  const itemGroupProps = useSelectItemGroupPropsContext()
  const mergedProps = mergeProps(select.getItemGroupLabelProps({ htmlFor: itemGroupProps.id }), props)

  return <ui.div {...mergedProps} ref={ref} />
})

SelectItemGroupLabel.displayName = 'SelectItemGroupLabel'

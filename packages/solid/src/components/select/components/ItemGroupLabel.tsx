import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'
import { useSelectItemGroupPropsContext } from '../hooks/use-select-item-group-props-context'

export interface SelectItemGroupLabelBaseProps extends PolymorphicProps<'div'> {}
export interface SelectItemGroupLabelProps
  extends HTMLProps<'div'>,
  SelectItemGroupLabelBaseProps {}

export function SelectItemGroupLabel(props: SelectItemGroupLabelProps) {
  const select = useSelectContext()
  const itemGroupProps = useSelectItemGroupPropsContext()
  const mergedProps = mergeProps(
    () => select().getItemGroupLabelProps({ htmlFor: itemGroupProps.id }),
    props,
  )

  return <ui.div {...mergedProps} />
}

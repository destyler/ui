import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface DynamicItemTextProps extends HTMLProps<'span'>, DynamicItemTextBaseProps {}

export function DynamicItemText(props: DynamicItemTextProps) {
  const api = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = mergeProps(() => api().getItemTextProps(itemProps), props)

  return <ui.span {...mergedProps} />
}

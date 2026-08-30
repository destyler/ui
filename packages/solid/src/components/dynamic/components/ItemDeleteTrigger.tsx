import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemDeleteTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DynamicItemDeleteTriggerProps
  extends HTMLProps<'button'>,
  DynamicItemDeleteTriggerBaseProps {}

export function DynamicItemDeleteTrigger(props: DynamicItemDeleteTriggerProps) {
  const api = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = mergeProps(() => api().getItemDeleteTriggerProps(itemProps), props)

  return <ui.button {...mergedProps} />
}

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DynamicClearTriggerProps
  extends HTMLProps<'button'>,
  DynamicClearTriggerBaseProps {}

export function DynamicClearTrigger(props: DynamicClearTriggerProps) {
  const api = useDynamicContext()
  const mergedProps = mergeProps(() => api().getClearTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

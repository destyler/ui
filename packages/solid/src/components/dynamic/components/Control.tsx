import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicControlBaseProps extends PolymorphicProps<'div'> {}
export interface DynamicControlProps extends HTMLProps<'div'>, DynamicControlBaseProps {}

export function DynamicControl(props: DynamicControlProps) {
  const api = useDynamicContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.div {...mergedProps} />
}

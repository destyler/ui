import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicLabelBaseProps extends PolymorphicProps<'label'> {}
export interface DynamicLabelProps extends HTMLProps<'label'>, DynamicLabelBaseProps {}

export function DynamicLabel(props: DynamicLabelProps) {
  const api = useDynamicContext()
  const mergedProps = mergeProps(() => api().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}

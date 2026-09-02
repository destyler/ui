import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSwitchContext } from '../hooks/use-switch-context'

export interface SwitchLabelBaseProps extends PolymorphicProps<'span'> {}
export interface SwitchLabelProps extends HTMLProps<'span'>, SwitchLabelBaseProps {}

export function SwitchLabel(props: SwitchLabelProps) {
  const api = useSwitchContext()
  const mergedProps = mergeProps(() => api().getLabelProps(), props)

  return <ui.span {...mergedProps} />
}

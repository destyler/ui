import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSwitchContext } from '../hooks/use-switch-context'

export interface SwitchControlBaseProps extends PolymorphicProps<'span'> {}
export interface SwitchControlProps extends HTMLProps<'span'>, SwitchControlBaseProps {}

export function SwitchControl(props: SwitchControlProps) {
  const api = useSwitchContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.span {...mergedProps} />
}

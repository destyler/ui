import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputControlBaseProps extends PolymorphicProps<'div'> {}
export interface NumberInputControlProps extends HTMLProps<'div'>, NumberInputControlBaseProps {}

export function NumberInputControl(props: NumberInputControlProps) {
  const api = useNumberInputContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.div {...mergedProps} />
}

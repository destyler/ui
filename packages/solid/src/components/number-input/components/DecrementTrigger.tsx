import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputDecrementTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface NumberInputDecrementTriggerProps
  extends HTMLProps<'button'>,
  NumberInputDecrementTriggerBaseProps {}

export function NumberInputDecrementTrigger(props: NumberInputDecrementTriggerProps) {
  const api = useNumberInputContext()
  const mergedProps = mergeProps(() => api().getDecrementTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

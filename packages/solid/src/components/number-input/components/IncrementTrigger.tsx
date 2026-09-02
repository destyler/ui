import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputIncrementTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface NumberInputIncrementTriggerProps
  extends HTMLProps<'button'>,
  NumberInputIncrementTriggerBaseProps {}

export function NumberInputIncrementTrigger(props: NumberInputIncrementTriggerProps) {
  const api = useNumberInputContext()
  const mergedProps = mergeProps(() => api().getIncrementTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface SelectTriggerProps extends HTMLProps<'button'>, SelectTriggerBaseProps {}

export function SelectTrigger(props: SelectTriggerProps) {
  const select = useSelectContext()
  const mergedProps = mergeProps(() => select().getTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

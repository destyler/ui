import type { TriggerProps } from '@destyler/combobox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxTriggerBaseProps extends TriggerProps, PolymorphicProps<'button'> {}
export interface ComboboxTriggerProps extends HTMLProps<'button'>, ComboboxTriggerBaseProps {}

export function ComboboxTrigger(props: ComboboxTriggerProps) {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['focusable'])
  const combobox = useComboboxContext()
  const mergedProps = mergeProps(() => combobox().getTriggerProps(triggerProps), localProps)

  return <ui.button {...mergedProps} />
}

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTooltipContext } from '../hooks/use-tooltip-context'

export interface TooltipTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface TooltipTriggerProps extends HTMLProps<'button'>, TooltipTriggerBaseProps {}

export function TooltipTrigger(props: TooltipTriggerProps) {
  const api = useTooltipContext()
  const mergedProps = mergeProps(() => api().getTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

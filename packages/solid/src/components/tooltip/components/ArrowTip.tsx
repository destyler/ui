import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTooltipContext } from '../hooks/use-tooltip-context'

export interface TooltipArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface TooltipArrowTipProps extends HTMLProps<'div'>, TooltipArrowTipBaseProps {}

export function TooltipArrowTip(props: TooltipArrowTipProps) {
  const api = useTooltipContext()
  const mergedProps = mergeProps(() => api().getArrowTipProps(), props)

  return <ui.div {...mergedProps} />
}

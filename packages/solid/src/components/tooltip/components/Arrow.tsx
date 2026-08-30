import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTooltipContext } from '../hooks/use-tooltip-context'

export interface TooltipArrowBaseProps extends PolymorphicProps<'div'> {}
export interface TooltipArrowProps extends HTMLProps<'div'>, TooltipArrowBaseProps {}

export function TooltipArrow(props: TooltipArrowProps) {
  const tooltip = useTooltipContext()
  const mergedProps = mergeProps(() => tooltip().getArrowProps(), props)

  return <ui.div {...mergedProps} />
}

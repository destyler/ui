import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useTooltipContext } from '../hooks/use-tooltip-context'

export interface TooltipArrowBaseProps extends PolymorphicProps {}
export interface TooltipArrowProps extends HTMLProps<'div'>, TooltipArrowBaseProps {}

export const TooltipArrow = forwardRef<HTMLDivElement, TooltipArrowProps>((props, ref) => {
  const tooltip = useTooltipContext()
  const mergedProps = mergeProps(tooltip.getArrowProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

TooltipArrow.displayName = 'TooltipArrow'

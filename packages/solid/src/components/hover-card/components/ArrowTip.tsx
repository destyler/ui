import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useHoverCardContext } from '../hooks/use-hover-card-context'

export interface HoverCardArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface HoverCardArrowTipProps extends HTMLProps<'div'>, HoverCardArrowTipBaseProps {}

export function HoverCardArrowTip(props: HoverCardArrowTipProps) {
  const hoverCard = useHoverCardContext()
  const mergedProps = mergeProps(() => hoverCard().getArrowTipProps(), props)

  return <ui.div {...mergedProps} />
}

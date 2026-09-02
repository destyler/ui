import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useHoverCardContext } from '../hooks/use-hover-card-context'

export interface HoverCardArrowBaseProps extends PolymorphicProps<'div'> {}
export interface HoverCardArrowProps extends HTMLProps<'div'>, HoverCardArrowBaseProps {}

export function HoverCardArrow(props: HoverCardArrowProps) {
  const hoverCard = useHoverCardContext()
  const mergedProps = mergeProps(() => hoverCard().getArrowProps(), props)

  return <ui.div {...mergedProps} />
}

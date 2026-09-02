import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useHoverCardContext } from '../hooks/use-hover-card-context'

export interface HoverCardTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface HoverCardTriggerProps extends HTMLProps<'button'>, HoverCardTriggerBaseProps {}

export function HoverCardTrigger(props: HoverCardTriggerProps) {
  const hoverCard = useHoverCardContext()
  const mergedProps = mergeProps({ type: 'button' }, () => hoverCard().getTriggerProps(), props)

  return <ui.button {...mergedProps} />
}

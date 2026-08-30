import type { ItemProps } from '@destyler/timer'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface TimerItemProps extends HTMLProps<'div'>, TimerItemBaseProps {}

export function TimerItem(props: TimerItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['type'])
  const timer = useTimerContext()

  const mergedProps = mergeProps(() => timer().getItemProps(itemProps), localProps)

  return <ui.div {...mergedProps}>{timer().formattedTime[itemProps.type]}</ui.div>
}

import type { ItemProps } from '@destyler/timer'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useTimerContext } from '../hooks/use-timer-context'

export interface TimerItemBaseProps extends ItemProps, PolymorphicProps {}
export interface TimerItemProps extends HTMLProps<'div'>, TimerItemBaseProps {}

export const TimerItem = forwardRef<HTMLDivElement, TimerItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['type'])
  const timer = useTimerContext()

  const mergedProps = mergeProps(timer.getItemProps(itemProps), localProps)

  return (
    <ui.div {...mergedProps} ref={ref}>
      {timer.formattedTime[itemProps.type]}
    </ui.div>
  )
})

TimerItem.displayName = 'TimerItem'

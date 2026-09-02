import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface PopoverTriggerProps extends HTMLProps<'button'>, PopoverTriggerBaseProps {}

export function PopoverTrigger(props: PopoverTriggerProps) {
  const api = usePopoverContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(
    () => api().getTriggerProps(),
    () => ({
      'aria-controls': presenceApi().unmounted
        ? null
        : api().getTriggerProps()['aria-controls'],
    }),
    props,
  )
  return <ui.button {...mergedProps} />
}

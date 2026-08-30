import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useTooltipContext } from '../hooks/use-tooltip-context'

export interface TooltipContentBaseProps extends PolymorphicProps<'div'> {}
export interface TooltipContentProps extends HTMLProps<'div'>, TooltipContentBaseProps {}

export function TooltipContent(props: TooltipContentProps) {
  const api = useTooltipContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(
    () => api().getContentProps(),
    () => presenceApi().presenceProps,
    props,
  )

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div
        {...mergedProps}
        ref={composeRefs(presenceApi().presenceProps.ref, props.ref)}
      />
    </Show>
  )
}

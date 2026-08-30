import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FloatingPanelTriggerProps
  extends HTMLProps<'button'>,
  FloatingPanelTriggerBaseProps {}

export function FloatingPanelTrigger(props: FloatingPanelTriggerProps) {
  const api = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    () => {
      const triggerProps = api().getTriggerProps()
      return {
        ...triggerProps,
        'aria-controls': presence().unmounted ? undefined : triggerProps['aria-controls'],
      }
    },
    props,
  )

  return <ui.button {...mergedProps} />
}

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface TourPositionerProps extends HTMLProps<'div'>, TourPositionerBaseProps {}

export function TourPositioner(props: TourPositionerProps) {
  const tour = useTourContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(() => tour().getPositionerProps(), props)

  return (
    <Show when={!presence().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}

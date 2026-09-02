import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourContentBaseProps extends PolymorphicProps<'div'> {}
export interface TourContentProps extends HTMLProps<'div'>, TourContentBaseProps {}

export function TourContent(props: TourContentProps) {
  const tour = useTourContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    () => tour().getContentProps(),
    () => presence().presenceProps,
    props,
  )

  return (
    <Show when={!presence().unmounted}>
      <ui.div
        {...mergedProps}
        ref={composeRefs(presence().presenceProps.ref, props.ref)}
      />
    </Show>
  )
}

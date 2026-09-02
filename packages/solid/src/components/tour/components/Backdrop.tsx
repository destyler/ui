import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo, Show } from 'solid-js'
import { usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useRenderStrategyContext } from '~/utils/render-strategy'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourBackdropBaseProps extends PolymorphicProps<'div'> {}
export interface TourBackdropProps extends HTMLProps<'div'>, TourBackdropBaseProps {}

export function TourBackdrop(props: TourBackdropProps) {
  const tour = useTourContext()
  const renderStrategyProps = useRenderStrategyContext()
  const present = createMemo(() => tour().open && Boolean(tour().step?.backdrop))
  const backdropPresence = usePresence(
    mergeProps(renderStrategyProps, () => ({ present: present() })),
  )
  const mergedProps = mergeProps(
    () => tour().getBackdropProps(),
    () => backdropPresence().presenceProps,
    props,
  )

  return (
    <Show when={!backdropPresence().unmounted}>
      <ui.div
        {...mergedProps}
        ref={composeRefs(backdropPresence().presenceProps.ref, props.ref)}
        hidden={Boolean(
          backdropPresence().presenceProps.hidden
          || props.hidden,
        )}
      />
    </Show>
  )
}

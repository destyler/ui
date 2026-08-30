import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useRenderStrategyContext } from '~/utils/render-strategy'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourSpotlightBaseProps extends PolymorphicProps<'div'> {}
export interface TourSpotlightProps extends HTMLProps<'div'>, TourSpotlightBaseProps {}

export function TourSpotlight(props: TourSpotlightProps) {
  const tour = useTourContext()
  const renderStrategyProps = useRenderStrategyContext()
  const presenceApi = usePresence(mergeProps(renderStrategyProps, () => ({ present: tour().open })))
  const mergedProps = mergeProps(
    () => tour().getSpotlightProps(),
    () => presenceApi().presenceProps,
    props,
  )

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div
        {...mergedProps}
        ref={composeRefs(presenceApi().presenceProps.ref, props.ref)}
        hidden={!tour().open || !tour().step?.target?.()}
      />
    </Show>
  )
}

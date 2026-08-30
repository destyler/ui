import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { useRenderStrategyContext } from '~/utils/render-strategy'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourBackdropBaseProps extends PolymorphicProps<'div'> {}
export interface TourBackdropProps extends HTMLProps<'div'>, TourBackdropBaseProps {}

export function TourBackdrop(props: TourBackdropProps) {
  const tour = useTourContext()
  const renderStrategyProps = useRenderStrategyContext()
  const presence = usePresence(mergeProps(renderStrategyProps, () => ({ present: tour().open })))
  const mergedProps = mergeProps(
    () => tour().getBackdropProps(),
    () => presence().presenceProps,
    props,
  )

  return (
    <Show when={!presence().unmounted}>
      <ui.div {...mergedProps} hidden={!tour().step?.backdrop} />
    </Show>
  )
}

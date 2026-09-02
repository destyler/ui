import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { ui } from '~/factory'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourArrowBaseProps extends PolymorphicProps<'div'> {}
export interface TourArrowProps extends HTMLProps<'div'>, TourArrowBaseProps {}

export function TourArrow(props: TourArrowProps) {
  const tour = useTourContext()
  const mergedProps = mergeProps(() => tour().getArrowProps(), props)

  return (
    <Show when={tour().step?.arrow}>
      <ui.div {...mergedProps} />
    </Show>
  )
}
